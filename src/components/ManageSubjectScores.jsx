import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { useUserProfile } from "../context/ProfileDataContex";
import { useUserAuth } from "../context/UserAuthContext";
import GradingCriteriaSetting from "./GradingCriteriaSetting";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { db } from "../firebase";
import "./ManageSubjectScores.css";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ---------- Utilities ----------
const pickGradeFromCriteria = (total, g) => {
  if (!g) return "";
  const thresholds = [
    { min: Number(g.grade4_0 ?? 80), grade: 4.0 },
    { min: Number(g.grade3_5 ?? 75), grade: 3.5 },
    { min: Number(g.grade3_0 ?? 70), grade: 3.0 },
    { min: Number(g.grade2_5 ?? 65), grade: 2.5 },
    { min: Number(g.grade2_0 ?? 60), grade: 2.0 },
    { min: Number(g.grade1_5 ?? 55), grade: 1.5 },
    { min: Number(g.grade1_0 ?? 50), grade: 1.0 },
  ];
  for (const t of thresholds) if (total >= t.min) return t.grade;
  return "0";
};

// ---------- Reusable Component ----------
const ScoreInput = ({ value, onChange, readOnly }) => (
  <Form.Control
    className="text-center"
    type="number"
    value={value || ""}
    onChange={onChange}
    readOnly={readOnly}
  />
);

function ManageSubjectScores() {
  const [students, setStudents] = useState([]);
  const [subjectID, setSubjectID] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [scoringCriteria, setScoringCriteria] = useState({});
  const [studentScores, setStudentScores] = useState({});
  const [gradingCriteria, setGradingCriteria] = useState({
    grade4_0: 80,
    grade3_5: 75,
    grade3_0: 70,
    grade2_5: 65,
    grade2_0: 60,
    grade1_5: 55,
    grade1_0: 50,
  });
  const [open, setOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hidingAlert, setHidingAlert] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { profileData } = useUserProfile();
  const { firstName, lastName } = useUserAuth();

  const thisYear = new Date().getFullYear() + 543;

  // ---------- Effects ----------
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    if (id) setSubjectID(id);
  }, [location.search]);

  useEffect(() => {
    if (!subjectID) return;
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snap) => {
      const currentSubject = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((s) => s.id === subjectID);
      setSubjectData(currentSubject);
    });
    return unsubscribe;
  }, [subjectID]);

  useEffect(() => {
    if (!profileData?.length) return;
    setStudents(profileData.filter((p) => p.user?.position === "นักเรียน"));
  }, [profileData]);

  useEffect(() => {
    if (!subjectID || !subjectData) return;
    const ref = doc(
      db,
      "school_record",
      thisYear.toString(),
      subjectData.classLevel,
      subjectID
    );
    const unsub1 = onSnapshot(ref, (snap) => {
      const data = snap.data();
      if (data) {
        setStudentScores(data.students || {});
        setScoringCriteria(data.scoring_criteria || {});
        setGradingCriteria(
          data.grading_criteria || {
            grade4_0: 80,
            grade3_5: 75,
            grade3_0: 70,
            grade2_5: 65,
            grade2_0: 60,
            grade1_5: 55,
            grade1_0: 50,
          }
        );
      }
    });
    return unsub1;
  }, [subjectID, subjectData]);

  // ---------- Handlers ----------
  const handleScoreChange = (studentID, term, field, value) => {
    setStudentScores((prev) => {
      const prevStudent = prev[studentID] || {};
      const prevTerm = prevStudent[term] || {};
      const numericValue = value === "" ? "" : Number(value);

      const newTerm = {
        ...prevTerm,
        [field]: numericValue,
      };

      if (["during", "final"].includes(field)) {
        newTerm.total =
          Number(newTerm.during || 0) + Number(newTerm.final || 0);
      }

      const updatedStudent = { ...prevStudent, [term]: newTerm };
      const termEntries = Object.entries(updatedStudent).filter(([k, v]) =>
        k.startsWith("term_")
      );

      const grandTotal = termEntries.reduce(
        (sum, [, v]) => sum + Number(v.total || 0),
        0
      );

      const hasBlank = termEntries.some(([, v]) =>
        ["indicator", "during", "final"].some(
          (k) => !v?.[k] || String(v[k]).trim() === ""
        )
      );

      updatedStudent.grandTotal = grandTotal;
      updatedStudent.result = hasBlank
        ? "ร"
        : pickGradeFromCriteria(grandTotal, gradingCriteria);

      return { ...prev, [studentID]: updatedStudent };
    });
  };

  const handleScoringCriteriaChange = (term, field, value) => {
    setScoringCriteria((prev) => {
      const prevTerm = prev[term] || {};
      const numericValue = value === "" ? "" : Number(value);
      const newTerm = { ...prevTerm, [field]: numericValue };

      if (["during", "final"].includes(field)) {
        newTerm.total =
          Number(newTerm.during || 0) + Number(newTerm.final || 0);
      }

      const updated = { ...prev, [term]: newTerm };
      updated.grandTotal =
        Number(updated.term_1?.total || 0) + Number(updated.term_2?.total || 0);
      return updated;
    });
  };

  const handleRadioChange = (studentID, val) => {
    setStudentScores((prev) => {
      const prevStudent = prev[studentID] || {};

      const updatedStudent = {
        ...prevStudent,
        evaluation_results: val,
      };
      return { ...prev, [studentID]: updatedStudent };
    });
  };

  const handleSaveSettings = async (form) => {
    try {
      const ref = doc(
        db,
        "school_record",
        thisYear.toString(),
        subjectData.classLevel,
        subjectID
      );

      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        await setDoc(ref, { added: true }, { merge: true });
      }

      // คำนวณผลลัพธ์ใหม่จาก grading criteria ที่บันทึก
      const updatedScores = { ...studentScores };
      const payload = { grading_criteria: form };

      Object.keys(updatedScores).forEach((sid) => {
        const s = updatedScores[sid] || {};
        // หาจำนวนรวมจาก term_x.total หรือ grandTotal ถ้ามี
        const termEntries = Object.entries(s).filter(([k]) =>
          k.startsWith("term_")
        );
        const grandTotal =
          termEntries.length > 0
            ? termEntries.reduce((sum, [, v]) => sum + Number(v.total || 0), 0)
            : Number(s.grandTotal || 0);

        const hasBlank = termEntries.some(([, v]) =>
          ["indicator", "during", "final"].some((k) => !v?.[k] && v?.[k] !== 0)
        );

        const result = hasBlank ? "ร" : pickGradeFromCriteria(grandTotal, form);

        // อัพเดต object ใน state และ payload ที่จะเขียนขึ้น Firestore
        updatedScores[sid] = { ...s, grandTotal, result };
        payload[`students.${sid}.grandTotal`] = grandTotal;
        payload[`students.${sid}.result`] = result;
      });

      // เขียน grading_criteria พร้อมผลการคำนวณของนักเรียน
      await updateDoc(ref, payload);

      // อัพเดต local state
      setGradingCriteria(form);
      setStudentScores(updatedScores);
    } catch (error) {
      console.error("Error saving grading criteria:", error);
    }
  };

  const saveAll = async () => {
    try {
      const ref = doc(
        db,
        "school_record",
        thisYear.toString(),
        subjectData.classLevel,
        subjectID
      );

      // ตรวจสอบว่า document มีอยู่หรือไม่ ถ้าไม่มีให้สร้างก่อน (upsert)
      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) {
        await setDoc(ref, { added: true }, { merge: true });
      }

      // เตรียม payload โดยคำนวณ grandTotal + result สำหรับแต่ละนักเรียน
      const payload = { scoring_criteria: scoringCriteria };
      const allIds = Object.keys(studentScores);
      const updatedScores = { ...studentScores };

      for (const sid of allIds) {
        const scoreObj = studentScores[sid] || {};

        const termEntries = Object.entries(scoreObj).filter(([k]) =>
          k.startsWith("term_")
        );
        const grandTotal =
          termEntries.length > 0
            ? termEntries.reduce((sum, [, v]) => sum + Number(v.total || 0), 0)
            : Number(scoreObj.grandTotal || 0);

        const hasBlank = termEntries.some(([, v]) =>
          ["indicator", "during", "final"].some((k) => !v?.[k] && v?.[k] !== 0)
        );

        const result = hasBlank ? "ร" : pickGradeFromCriteria(grandTotal, gradingCriteria);

        const updatedStudent = { ...scoreObj, grandTotal, result };
        updatedScores[sid] = updatedStudent;

        payload[`students.${sid}`] = { ...updatedStudent };
      }

      await updateDoc(ref, payload);
      console.log("All scores saved successfully.");
      setStudentScores(updatedScores);
      setSaveSuccess(true);

      // เริ่มเล่น slideUp โดยเพิ่มคลาส hide หลังแสดง 2s
      setTimeout(() => setHidingAlert(true), 2000);
      // รอ animation (240ms) ให้จบก่อนลบ element และรีเซ็ตสถานะ
      setTimeout(() => {
        setSaveSuccess(false);
        setHidingAlert(false);
      }, 2000 + 240);
    } catch (err) {
      console.error("Error updating document:", err);
    }
  };

  // ---------- Render ----------
  const studentsInClass = students.filter(
    (s) => s.user?.classLevel === subjectData?.classLevel
  );

  return (
    <div style={{ background: "#BBBBBB" }}>
      <Navbar />
      <div className="p-3 page-detail">
        {saveSuccess && (
          <div
            className={`floating-alert ${hidingAlert ? "hide" : ""}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            บันทึกเสร็จเรียบร้อย
          </div>
        )}
        <div className="bg-white page-detail-box">
          <div className="d-flex flex-column justify-content-center  fw-bold p-3 text-center w-100">
            <div
              className="custom-h1 w-100 d-flex justify-content-center align-items-center"
              style={{ position: "relative" }}
            >
              จัดการคะแนนรายวิชา{" "}
              <svg
                className="setting-butt"
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                onClick={() => setOpen(true)}
                aria-label="เปิดหน้าตั้งค่าเกณฑ์การตัดเกรด"
                role="button"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M14.208 4.83q.68.21 1.3.54l1.833-1.1a1 1 0 0 1 1.221.15l1.018 1.018a1 1 0 0 1 .15 1.221l-1.1 1.833q.33.62.54 1.3l2.073.519a1 1 0 0 1 .757.97v1.438a1 1 0 0 1-.757.97l-2.073.519q-.21.68-.54 1.3l1.1 1.833a1 1 0 0 1-.15 1.221l-1.018 1.018a1 1 0 0 1-1.221.15l-1.833-1.1q-.62.33-1.3.54l-.519 2.073a1 1 0 0 1-.97.757h-1.438a1 1 0 0 1-.97-.757l-.519-2.073a7.5 7.5 0 0 1-1.3-.54l-1.833 1.1a1 1 0 0 1-1.221-.15L4.42 18.562a1 1 0 0 1-.15-1.221l1.1-1.833a7.5 7.5 0 0 1-.54-1.3l-2.073-.519A1 1 0 0 1 2 12.72v-1.438a1 1 0 0 1 .757-.97l2.073-.519q.21-.68.54-1.3L4.27 6.66a1 1 0 0 1 .15-1.221L5.438 4.42a1 1 0 0 1 1.221-.15l1.833 1.1q.62-.33 1.3-.54l.519-2.073A1 1 0 0 1 11.28 2h1.438a1 1 0 0 1 .97.757zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                />
              </svg>
            </div>
            <div className="custom-h2">
              {subjectData?.id} {subjectData?.name} {subjectData?.classLevel}
            </div>
          </div>
          <div className="subject-scores-table w-100 p-3">
            <table className="w-100">
              <thead>
                <tr>
                  <th
                    rowSpan={4}
                    className="text-center"
                    style={{ minWidth: "120px", borderTopLeftRadius: "20px" }}
                  >
                    รหัสประจำตัว
                  </th>
                  <th
                    rowSpan={4}
                    className="text-center"
                    style={{ minWidth: "200px" }}
                  >
                    ชื่อ - นามสกุล
                  </th>
                  <th colSpan={4} className="text-center">
                    ภาคเรียนที่ 1
                  </th>
                  <th colSpan={4} className="text-center">
                    ภาคเรียนที่ 2
                  </th>
                  <th colSpan={2} className="text-center">
                    ผลการเรียนรู้รายปี
                  </th>

                  <th rowSpan={4} className="text-center">
                    ชั่วโมงเรียน
                  </th>
                  <th rowSpan={4} className="text-center">
                    ผลการแก้ไข
                  </th>
                  <th rowSpan={2} colSpan={2} className="text-center">
                    สรุปผลการประเมิน
                  </th>
                  <th rowSpan={4} className="text-center">
                    หมายเหตุ
                  </th>
                </tr>
                <tr className="grade-header">
                  <th rowSpan={2} className="text-center">
                    ตัวชี้วัด
                  </th>
                  <th className="text-center">ระหว่างเรียน</th>
                  <th className="text-center">ปลายภาค</th>
                  <th className="text-center">รวม</th>
                  <th rowSpan={2} className="text-center">
                    ตัวชี้วัด
                  </th>
                  <th className="text-center">ระหว่างเรียน</th>
                  <th className="text-center">ปลายภาค</th>
                  <th className="text-center">รวม</th>
                  <th className="text-center">รวม 2 ภาค</th>
                  <th rowSpan={3} className="text-center">
                    ระดับผลการเรียน
                  </th>
                </tr>
                <tr className="grade-header">
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th rowSpan={2} className="text-center">
                    ผ่าน
                  </th>
                  <th rowSpan={2} className="text-center">
                    ไม่ผ่าน
                  </th>
                </tr>
                <tr>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_1?.indicator || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_1",
                          "indicator",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_1?.during || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_1",
                          "during",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_1?.final || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_1",
                          "final",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_1?.total || ""}
                      readOnly
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_2?.indicator || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_2",
                          "indicator",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_2?.during || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_2",
                          "during",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_2?.final || ""}
                      onChange={(e) => {
                        handleScoringCriteriaChange(
                          "term_2",
                          "final",
                          e.target.value
                        );
                      }}
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.term_2?.total || ""}
                      readOnly
                    />
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control
                      className="text-center"
                      type="number"
                      value={scoringCriteria?.grandTotal || ""}
                      readOnly
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsInClass
                  .slice()
                  .sort((a, b) => {
                    const idA = parseInt(a.user.studentID, 10);
                    const idB = parseInt(b.user.studentID, 10);
                    return idA - idB;
                  })
                  .map((student) => {
                    const sid = student.user.studentID;
                    return (
                      <tr
                        key={student.id}
                        className={`grade-header ${
                          selectedRow === student.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedRow(student.id)}
                      >
                        <td className="text-center">
                          {student.user.studentID}
                        </td>
                        <td className="text-center">
                          {student.user.firstName} {student.user.lastName}
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_1
                                ?.indicator || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_1",
                                "indicator",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_1
                                ?.during || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_1",
                                "during",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_1
                                ?.final || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_1",
                                "final",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_1
                                ?.total || ""
                            }
                            readOnly
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_2
                                ?.indicator || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_2",
                                "indicator",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_2
                                ?.during || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_2",
                                "during",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_2
                                ?.final || ""
                            }
                            onChange={(e) =>
                              handleScoreChange(
                                student.user.studentID,
                                "term_2",
                                "final",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]?.term_2
                                ?.total || ""
                            }
                            readOnly
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="number"
                            value={
                              studentScores[student.user.studentID]
                                ?.grandTotal || ""
                            }
                            readOnly
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control
                            className="text-center"
                            type="text"
                            value={
                              studentScores[student.user.studentID]?.result ||
                              "ร"
                            }
                            readOnly
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control type="text" />
                        </td>
                        <td className="text-center">
                          <Form.Control type="text" />
                        </td>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`choice-${sid}`}
                            value="ผ่าน"
                            checked={
                              studentScores[student.user.studentID]
                                ?.evaluation_results === "ผ่าน"
                            }
                            onChange={() => handleRadioChange(sid, "ผ่าน")}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`choice-${sid}`}
                            value="ไม่ผ่าน"
                            checked={
                              studentScores[student.user.studentID]
                                ?.evaluation_results === "ไม่ผ่าน"
                            }
                            onChange={() => handleRadioChange(sid, "ไม่ผ่าน")}
                          />
                        </td>
                        <td className="text-center">
                          <Form.Control type="text" />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="d-flex justify-content-center align-items-center w-100 py-3 gap-3">
              <button
                className="cancel-butt"
                onClick={() => navigate("/grade-management")}
              >
                ยกเลิก
              </button>
              <button className="save-butt" onClick={saveAll}>
                บันทึก
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        <GradingCriteriaSetting
          show={open}
          onClose={() => setOpen(false)}
          onSave={handleSaveSettings}
          initial={gradingCriteria}
        />
      </div>
      <Footer />
    </div>
  );
}

export default ManageSubjectScores;
