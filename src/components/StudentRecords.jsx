import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import { onSnapshot, collection, doc, getDocs } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import "./StudentRecords.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function StudentRecords() {
  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [switchDisplay, setSwitchDisplay] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentProfile, setStudentProfile] = useState(null);
  const [classLevel, setClassLevel] = useState("");
  const [recordData, setRecordData] = useState(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [pendingSubjects, setPendingSubjects] = useState([]);
  const [approvalStatusMap, setApprovalStatusMap] = useState({}); // subjectId -> latest status
  const [computedGpa, setComputedGpa] = useState(null);

  const navigate = useNavigate();
  const { user } = useUserAuth();

  // get student profile
  useEffect(() => {
    if (!user.uid) return;

    const unsubscribe = onSnapshot(doc(db, "profile", user.uid), (snapshot) => {
      const newData = snapshot.data();
      if (!newData) return;
      setStudentProfile(newData.user || {});
      setClassLevel(newData.user.classLevel || "");
      setStudentId(newData.user.studentID || "");
    });

    return () => unsubscribe();
  }, [user.uid]);

  // get year
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "school_record"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // ถ้ามี studentId อย่างน้อย 2 หลัก ให้กรองตามเงื่อนไข
      if (studentId && String(studentId).length >= 2) {
        const studentPrefix = parseInt(String(studentId).slice(0, 2), 10);
        if (!Number.isNaN(studentPrefix)) {
          const filtered = data.filter((item) => {
            const yearLast2 = parseInt(String(item.id).slice(-2), 10);
            if (Number.isNaN(yearLast2)) return false;
            return yearLast2 >= studentPrefix;
          });
          setYear(filtered);
          return;
        }
      }

      // กรณีไม่มี studentId หรือไม่สามารถ parse ได้ ให้ใช้ครบทุกปี
      setYear(data);
    });

    return () => unsubscribe();
  }, [studentId]);

  // subscribe approval requests and build a map subjectId -> status
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "approval_requests"), (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        const sid = data.subjectID;
        if (!sid) return;
        const status = data.status || null;
        // keep priority: if any request for sid is "pending" or "approved" we keep that
        // prefer "approved" over "pending" if both exist
        if (!map[sid]) {
          map[sid] = status;
        } else {
          if (map[sid] !== "approved" && status === "approved") map[sid] = "approved";
          if (map[sid] !== "pending" && status === "pending") map[sid] = "pending";
        }
      });
      setApprovalStatusMap(map);
      // Backward-compatible: keep pendingSubjects for other uses if any (optional)
      setPendingSubjects(
        Object.entries(map)
          .filter(([, s]) => s === "pending")
          .map(([sid]) => sid)
      );
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!classLevel && !selectedYear) return;

    let primaryLevel = "";
    if (studentId && selectedYear) {
      const stuPrefix = parseInt(String(studentId).slice(0, 2), 10);
      const yearSuffix = parseInt(String(selectedYear).slice(-2), 10);
      if (!isNaN(stuPrefix) && !isNaN(yearSuffix)) {
        const diff = stuPrefix - yearSuffix + 1;
        if (diff >= 1 && diff <= 6) {
          primaryLevel = `ประถมศึกษาปีที่ ${diff}`;
        }
      }
    }

    const colRef = collection(
      db,
      "school_record",
      String(selectedYear),
      primaryLevel || classLevel.replace(/\//g, "-")
    );

    const unsubscribe = onSnapshot(colRef, (qSnap) => {
      const rows = qSnap.docs
        .map((d) => {
          const data = d.data();
          const stu = data?.students?.[studentId];
          if (!stu) return null;

          // check pending approval for this subject/year/class/student
          const subjectId = data.id ?? d.id;
          const statusForThis = approvalStatusMap[subjectId] || null;
          // ถ้าไม่มี status == 'approved' หรือ 'pending' => ให้มองว่าเป็น "ไม่มีอนุมัติ" => ตั้งค่าเป็น 0
          const hasApprovedOrPending = statusForThis === "approved" || statusForThis === "pending";

          const studentCopy = { ...stu };
          if (!hasApprovedOrPending) {
            // ไม่มีการอนุมัติหรือคำขอค้าง -> แสดงค่าเป็น 0
            if (studentCopy.grandTotal != null) studentCopy.grandTotal = 0;
            if (studentCopy.result != null) studentCopy.result = 0;
          }

          // copy scoring_criteria and force grandTotal = 0 when pending
          const scoringCopy = { ...(data.scoring_criteria || {}) };
          if (!hasApprovedOrPending) {
            scoringCopy.grandTotal = 0;
          }

          return {
            subjectId: subjectId,
            studentId: studentId,
            student: studentCopy,
            scoring_criteria: scoringCopy,
            grading_criteria: data.grading_criteria,
          };
        })
        .filter(Boolean);

      setRecordData(rows);
    });

    return unsubscribe;
  }, [db, classLevel, studentId, selectedYear, pendingSubjects]);

  // คำนวณเกรดเฉลี่ยโดยเอา result ของแต่ละปี (year) มาคำนวณ
  useEffect(() => {
    if (!studentId || !year || year.length === 0) {
      setComputedGpa(null);
      return;
    }

    let cancelled = false;

    const computeAcrossYears = async () => {
      try {
        const perYearAverages = [];

        for (const y of year) {
          const yearId = String(y.id);
          // หา primaryLevel สำหรับปีนั้น (logic เดียวกับ useEffect ข้างบน)
          let primaryLevel = "";
          const stuPrefix = parseInt(String(studentId).slice(0, 2), 10);
          const yearSuffix = parseInt(String(yearId).slice(-2), 10);
          if (!Number.isNaN(stuPrefix) && !Number.isNaN(yearSuffix)) {
            const diff = stuPrefix - yearSuffix + 1;
            if (diff >= 1 && diff <= 6) {
              primaryLevel = `ประถมศึกษาปีที่ ${diff}`;
            }
          }
          const classPath = primaryLevel || classLevel.replace(/\//g, "-");

          // อ่านเอกสารทั้งหมดใน collection ของชั้นเรียนปีนั้น
          const colRef = collection(db, "school_record", yearId, classPath);
          const snap = await getDocs(colRef);

          const resultsForYear = [];

          snap.docs.forEach((d) => {
            const data = d.data();
            const sid = data.id ?? d.id;
            const stu = data?.students?.[studentId];
            if (!stu) return;

            // ตรวจสอบสถานะอนุมัติจาก map (ถ้าไม่มี approved/pending => ให้ 0)
            const statusForThis = approvalStatusMap[sid] || null;
            const hasApprovedOrPending =
              statusForThis === "approved" || statusForThis === "pending";

            const resultValue =
              !hasApprovedOrPending || stu.result == null ? 0 : Number(stu.result);

            // เก็บค่า result ของแต่ละวิชาในปีนี้
            resultsForYear.push(resultValue);
          });

          if (resultsForYear.length > 0) {
            const sum = resultsForYear.reduce((a, b) => a + b, 0);
            perYearAverages.push(sum / resultsForYear.length);
          }
        }

        if (cancelled) return;

        if (perYearAverages.length === 0) {
          setComputedGpa(null);
        } else {
          const overall =
            perYearAverages.reduce((a, b) => a + b, 0) / perYearAverages.length;
          setComputedGpa(Number(overall.toFixed(2)));
        }
      } catch (err) {
        console.error("Error computing GPA across years:", err);
        setComputedGpa(null);
      }
    };

    computeAcrossYears();

    return () => {
      cancelled = true;
    };
  }, [year, studentId, classLevel, approvalStatusMap, db]);

  const handleWatchRecords = async (e, yearId) => {
    setSelectedYear(yearId);
    setSwitchDisplay(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubject(data);
    });

    return () => unsubscribe();
  }, []);

  const gpa = useMemo(() => {
    if (!recordData || recordData.length === 0) return "-";
    const sum = recordData.reduce(
      (acc, row) => acc + Number(row.student?.result || 0),
      0
    );
    console.log("GPA calculation:", sum, recordData.length);
    return (sum / recordData.length).toFixed(2);
  }, [recordData]);

  return (
    <div style={{ backgroundColor: "#d9d9d9" }}>
      <Navbar />
      <div className="student-records">
        <div className="student-records-detail">
          <div className="custom-h1 fw-bold">ผลคะแนนรายวิชา</div>
          <hr />
          <div className="d-flex flex-column justify-content-start align-items-start gap-1 custom-h3 fw-bold mb-3 ms-3">
            <div>รหัสนักเรียน: {studentId}</div>
            <div>
              ชื่อ - สกุล: {studentProfile?.firstName ?? ""}{" "}
              {studentProfile?.lastName ?? ""}
            </div>
            <div>ชั้น: {studentProfile?.classLevel ?? ""}</div>
            <div>เกรดเฉลี่ยสะสม (GPA): {computedGpa != null ? computedGpa : (studentProfile?.gpa ?? "-")}</div>
          </div>

          {!switchDisplay ? (
            <table className="student-records-table">
              <thead>
                <tr>
                  <th>ปีการศึกษา</th>
                  <th>คะแนนเก็บ</th>
                </tr>
              </thead>
              <tbody>
                {year.map((item) => (
                  <tr key={item.id}>
                    <td className="w-50">{item.id}</td>
                    <td className="w-50">
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <button
                          onClick={(e) => handleWatchRecords(e, item.id)}
                          className="view-button"
                        >
                          ดูคะแนน
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <table className="student-records-table-2">
                <thead>
                  <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>คะแนนเต็ม</th>
                    <th>คะแนนที่ได้</th>
                    <th>ระดับผลการเรียน</th>
                  </tr>
                </thead>
                <tbody>
                  {recordData.map((row, idx) => (
                    <tr key={row.subjectId}>
                      <td>{row.subjectId}</td>
                      <td>
                        {subject.find((sub) => sub.id === row.subjectId)?.name}
                      </td>
                      <td>{row.scoring_criteria.grandTotal}</td>
                      <td>{row.student.grandTotal}</td>
                      <td>{row.student.result}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#efefef" }}>
                    <td className="text-center border-end" colSpan={3}></td>
                    <td className="text-center fw-bold border-start border-end">เกรดเฉลี่ย</td>
                    <td className="text-center fw-bold border-start">{gpa}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                  className="delete-butt"
                  onClick={() => setSwitchDisplay(false)}
                >
                  กลับ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentRecords;
