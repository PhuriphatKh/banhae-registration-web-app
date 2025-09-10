import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Form } from "react-bootstrap";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useStudentTable } from "../context/StudentTableContex";

// --- Static configs (ย้ายออกนอก component เพื่อลด re-create) ---
const CLASS_TABLE_IDS = {
  "ประถมศึกษาปีที่ 1": "j8AzXNhqKwCBoInfAt1f",
  "ประถมศึกษาปีที่ 2": "jehvrtW8WQnbgQUFpQ3A",
  "ประถมศึกษาปีที่ 3": "N0UMUb6jNC3f0bMjgEyZ",
  "ประถมศึกษาปีที่ 4": "kpSW5PxJ5xgxg3EEI7om",
  "ประถมศึกษาปีที่ 5": "Vr4gnaex3VvDpYpkSerq",
  "ประถมศึกษาปีที่ 6": "idKJQ8WN6fLccjCX5RCK",
};

const SEMESTERS = [1, 2];

const CLASS_TABLE = [
  "ประถมศึกษาปีที่ 1",
  "ประถมศึกษาปีที่ 2",
  "ประถมศึกษาปีที่ 3",
  "ประถมศึกษาปีที่ 4",
  "ประถมศึกษาปีที่ 5",
  "ประถมศึกษาปีที่ 6",
];

// คีย์ชื่อคาบเรียนทั้งหมด เพื่อช่วย loop set/get
const PERIOD_KEYS = [
  "mon0830",
  "mon0930",
  "mon1030",
  "mon1230",
  "mon1330",
  "mon1430",
  "tue0830",
  "tue0930",
  "tue1030",
  "tue1230",
  "tue1330",
  "tue1430",
  "wed0830",
  "wed0930",
  "wed1030",
  "wed1230",
  "wed1330",
  "wed1430",
  "thu0830",
  "thu0930",
  "thu1030",
  "thu1230",
  "thu1330",
  "thu1430",
  "fri0830",
  "fri0930",
  "fri1030",
  "fri1230",
  "fri1330",
  "fri1430",
];

function StudentTableManagement() {
  const { studentTableData } = useStudentTable();
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "school_record"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAcademicYears(data);
        console.log("Year data updated:", data);
      }
    );

    return () => unsubscribe();
  }, []);

  // === States พื้นฐาน ===
  const [regAcademicYear, setRegAcademicYear] = useState(2567);
  const [regSemester, setRegSemester] = useState(1);
  const [regClassLevel, setRegClassLevel] = useState("ประถมศึกษาปีที่ 1");
  const [subjects, setSubjects] = useState([]);
  const [teachersMap, setTeachersMap] = useState({});
  const [regTimeTable, setRegTimeTable] = useState([
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
  ]);
  const [error, setError] = useState("");

  // === States ของรายคาบ (คงชื่อ state เดิมไว้เพื่อไม่ไปเปลี่ยนส่วน render) ===
  const [regMon0830, setRegMon0830] = useState("-");
  const [regMon0930, setRegMon0930] = useState("-");
  const [regMon1030, setRegMon1030] = useState("-");
  const [regMon1230, setRegMon1230] = useState("-");
  const [regMon1330, setRegMon1330] = useState("-");
  const [regMon1430, setRegMon1430] = useState("-");

  const [regTue0830, setRegTue0830] = useState("-");
  const [regTue0930, setRegTue0930] = useState("-");
  const [regTue1030, setRegTue1030] = useState("-");
  const [regTue1230, setRegTue1230] = useState("-");
  const [regTue1330, setRegTue1330] = useState("-");
  const [regTue1430, setRegTue1430] = useState("-");

  const [regWed0830, setRegWed0830] = useState("-");
  const [regWed0930, setRegWed0930] = useState("-");
  const [regWed1030, setRegWed1030] = useState("-");
  const [regWed1230, setRegWed1230] = useState("-");
  const [regWed1330, setRegWed1330] = useState("-");
  const [regWed1430, setRegWed1430] = useState("-");

  const [regThu0830, setRegThu0830] = useState("-");
  const [regThu0930, setRegThu0930] = useState("-");
  const [regThu1030, setRegThu1030] = useState("-");
  const [regThu1230, setRegThu1230] = useState("-");
  const [regThu1330, setRegThu1330] = useState("-");
  const [regThu1430, setRegThu1430] = useState("-");

  const [regFri0830, setRegFri0830] = useState("-");
  const [regFri0930, setRegFri0930] = useState("-");
  const [regFri1030, setRegFri1030] = useState("-");
  const [regFri1230, setRegFri1230] = useState("-");
  const [regFri1330, setRegFri1330] = useState("-");
  const [regFri1430, setRegFri1430] = useState("-");

  // --- Helpers: สร้าง map ของ setter เพื่อ loop อัปเดตได้ทีเดียว ---
  const setters = useMemo(
    () => ({
      mon0830: setRegMon0830,
      mon0930: setRegMon0930,
      mon1030: setRegMon1030,
      mon1230: setRegMon1230,
      mon1330: setRegMon1330,
      mon1430: setRegMon1430,
      tue0830: setRegTue0830,
      tue0930: setRegTue0930,
      tue1030: setRegTue1030,
      tue1230: setRegTue1230,
      tue1330: setRegTue1330,
      tue1430: setRegTue1430,
      wed0830: setRegWed0830,
      wed0930: setRegWed0930,
      wed1030: setRegWed1030,
      wed1230: setRegWed1230,
      wed1330: setRegWed1330,
      wed1430: setRegWed1430,
      thu0830: setRegThu0830,
      thu0930: setRegThu0930,
      thu1030: setRegThu1030,
      thu1230: setRegThu1230,
      thu1330: setRegThu1330,
      thu1430: setRegThu1430,
      fri0830: setRegFri0830,
      fri0930: setRegFri0930,
      fri1030: setRegFri1030,
      fri1230: setRegFri1230,
      fri1330: setRegFri1330,
      fri1430: setRegFri1430,
    }),
    []
  );

  const tableID = useMemo(
    () => CLASS_TABLE_IDS[regClassLevel] || "",
    [regClassLevel]
  );

  // ดึงข้อมูลตารางเรียนของชั้น/ปี/เทอมปัจจุบัน
  const table = useMemo(
    () =>
      studentTableData.find(
        (item) => item.id === tableID + regAcademicYear + "_" + regSemester
      ),
    [studentTableData, tableID, regAcademicYear, regSemester]
  );

  // โหลดชื่อครูจาก Firestore (แก้บั๊กตัวแปร last ไม่ได้ประกาศ)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "profile"), (snap) => {
      const map = {};
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        const first = d?.user?.firstName ?? d?.firstName ?? "";
        const last = d?.user?.lastName ?? d?.lastName ?? "";
        const display =
          first || last ? `${first} ${last}`.trim() : "(ไม่มีชื่อ)";
        map[docSnap.id] = display;
      });
      setTeachersMap(map);
      console.log("Teachers updated:", map);
    });
    return () => unsubscribe();
  }, []);

  const getTeacherName = useCallback(
    (uid) => (!uid ? "-" : teachersMap?.[uid] || String(uid)),
    [teachersMap]
  );

  const formatSubjectName = useCallback((name) => {
    if (!name) return "";
    return name.split(" ").map((word, idx) => <div key={idx}>{word}</div>);
  }, []);

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
          {subject.id} {subject.name}
        </option>
      )),
    [subjects]
  );

  const getSubjectDisplay = useCallback(
    (subjectId) => {
      if (!subjectId || subjectId === "-") return "-";
      const subject = subjects.find((s) => s.id === subjectId);
      if (!subject) return subjectId;
      return (
        <>
          <div style={{ fontSize: "0.6vw" }}>{subject.id}</div>
          <div
            className="d-flex flex-column align-items-center"
            style={{ fontSize: "0.6vw" }}
          >
            {formatSubjectName(subject.name)}
          </div>
          <div style={{ fontSize: "0.6vw" }}>
            {getTeacherName(subject.teacherId || "-")}
          </div>
        </>
      );
    },
    [subjects, formatSubjectName, getTeacherName]
  );

  // Helper: เซตค่า state รายคาบทั้งหมดจาก table (หรือรีเซ็ตเป็น '-')
  const applyTableToStates = useCallback(
    (t) => {
      PERIOD_KEYS.forEach((k) => {
        const setter = setters[k];
        if (setter) setter(t ? t[k] ?? "-" : "-");
      });
    },
    [setters]
  );

  // เมื่อ table เปลี่ยน ให้เติมค่า หรือรีเซ็ต
  useEffect(() => {
    if (table) {
      applyTableToStates(table);
      console.log("📋 TeacherTable:", table);
    } else {
      applyTableToStates(undefined);
      console.log("⚠️ ไม่พบตารางเวลา → เซตเป็น '-'");
    }
  }, [table, applyTableToStates]);

  // บันทึกข้อมูล (สร้าง payload ด้วย loop แทนการพิมพ์ซ้ำ)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!tableID) {
      setError("กรุณาเลือกระดับชั้นเรียนให้ถูกต้อง");
      return;
    }

    try {
      // รวมค่าจาก state รายคาบทั้งหมด
      const regValues = {
        mon0830: regMon0830,
        mon0930: regMon0930,
        mon1030: regMon1030,
        mon1230: regMon1230,
        mon1330: regMon1330,
        mon1430: regMon1430,
        tue0830: regTue0830,
        tue0930: regTue0930,
        tue1030: regTue1030,
        tue1230: regTue1230,
        tue1330: regTue1330,
        tue1430: regTue1430,
        wed0830: regWed0830,
        wed0930: regWed0930,
        wed1030: regWed1030,
        wed1230: regWed1230,
        wed1330: regWed1330,
        wed1430: regWed1430,
        thu0830: regThu0830,
        thu0930: regThu0930,
        thu1030: regThu1030,
        thu1230: regThu1230,
        thu1330: regThu1330,
        thu1430: regThu1430,
        fri0830: regFri0830,
        fri0930: regFri0930,
        fri1030: regFri1030,
        fri1230: regFri1230,
        fri1330: regFri1330,
        fri1430: regFri1430,
      };

      const studentTable = {
        classLevel: regClassLevel,
        academicYear: regAcademicYear,
        semester: regSemester,
        ...regValues,
      };

      await setDoc(
        doc(db, "student_table", tableID + regAcademicYear + "_" + regSemester),
        studentTable
      );
      console.log("Data saved to FireStore!");
    } catch (error) {
      console.log(error);
    }
  };

  // โหลดตารางเวลาเรียน (ช่วงเวลา) จาก time_table
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "time_table", "GnIYgvi6eieBMulTF8eK"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const newTimeTable = [1, 2, 3, 4, 5, 6].map(
            (n) =>
              data[n] || {
                startHour: "",
                startMinute: "",
                endHour: "",
                endMinute: "",
              }
          );
          setRegTimeTable(newTimeTable);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // โหลดรายวิชาตามชั้นเรียน
  useEffect(() => {
    const q = query(
      collection(db, "subjects"),
      where("classLevel", "==", regClassLevel)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = [];
      snapshot.forEach((docSnap) =>
        newData.push({ id: docSnap.id, ...docSnap.data() })
      );
      setSubjects(newData);
      console.log("Subjects updated:", newData);
    });
    return () => unsubscribe();
  }, [regClassLevel]);

  return (
    <div style={{ backgroundColor: "#BBBBBB", minWidth: "fit-content" }}>
      <Navbar />

      <div className="p-3 page-detail">
        <div className="d-flex student-page-detail-box">
          <div className="p-2" style={{ width: "40%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                จัดการตารางเรียน
              </div>
              <form
                onSubmit={handleSave}
                className="d-flex flex-column align-items-center p-2 gap-2 h-100"
                id="t-manage"
                style={{ backgroundColor: "white" }}
              >
                <div className="d-flex flex-column align-items-center ps-2 gap-2 w-100">
                  <div className="custom-h3">ตัวเลือก</div>
                  <div className="d-flex w-100 gap-2">
                    <div className="select-wrapper" style={{ width: "33.33%" }}>
                      <Form.Select
                        className="modern-select text-center"
                        style={{ fontSize: "0.8vw", height: "3rem" }}
                        onChange={(e) => setRegClassLevel(e.target.value)}
                      >
                        <option value="" disabled>
                          -- เลือกชั้นเรียน --
                        </option>
                        {CLASS_TABLE.map((classItem) => (
                          <option key={classItem} value={classItem}>
                            {classItem}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="select-wrapper" style={{ width: "33.33%" }}>
                      <Form.Select
                        className="text-center modern-select"
                        style={{ fontSize: "0.8vw", height: "3rem" }}
                        value={regAcademicYear}
                        onChange={(e) =>
                          setRegAcademicYear(Number(e.target.value))
                        }
                      >
                        <option value="" disabled>
                          -- ปีการศึกษา --
                        </option>
                        {academicYears.map((item) => (
                          <option key={item.id} value={item.id}>
                            ปีการศึกษา {item.id}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="select-wrapper" style={{ width: "33.33%" }}>
                      <Form.Select
                        className="text-center modern-select"
                        style={{ fontSize: "0.8vw", height: "3rem" }}
                        value={regSemester}
                        onChange={(e) => setRegSemester(Number(e.target.value))}
                      >
                        <option value="" disabled>
                          -- ภาคเรียนที่ --
                        </option>
                        {SEMESTERS.map((sem) => (
                          <option key={sem} value={sem}>
                            ภาคเรียนที่ {sem}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start border border-black w-100 h-100">
                  <div
                    className="h-100 border-end border-black"
                    style={{ flex: 1 }}
                  >
                    <div
                      className="custom-h3 d-flex justify-content-center align-items-center border-bottom border-black"
                      style={{ background: "#FFD786", height: "5%" }}
                    >
                      วัน
                    </div>
                    <div
                      className="w-100 d-flex flex-column"
                      style={{ height: "95%" }}
                    >
                      <div
                        className="border-bottom border-black d-flex justify-content-center align-items-center"
                        style={{ height: "20%" }}
                      >
                        จันทร์
                      </div>
                      <div
                        className="border-bottom border-black d-flex justify-content-center align-items-center"
                        style={{ height: "20%" }}
                      >
                        อังคาร
                      </div>
                      <div
                        className="border-bottom border-black d-flex justify-content-center align-items-center"
                        style={{ height: "20%" }}
                      >
                        พุธ
                      </div>
                      <div
                        className="border-bottom border-black d-flex justify-content-center align-items-center"
                        style={{ height: "20%" }}
                      >
                        พฤหัสบดี
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "20%" }}
                      >
                        ศุกร์
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-100 border-end border-black"
                    style={{ flex: 1 }}
                  >
                    <div
                      className="custom-h3 d-flex justify-content-center align-items-center border-bottom border-black"
                      style={{ background: "#FFD786", height: "5%" }}
                    >
                      เวลา
                    </div>
                    <div
                      className="w-100 d-flex flex-column"
                      style={{ height: "95%" }}
                    >
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{ height: "20%", background: "#BBBBBB" }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[0].startHour}:
                          {regTimeTable[0].startMinute} -{" "}
                          {regTimeTable[0].endHour}:{regTimeTable[0].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[1].startHour}:
                          {regTimeTable[1].startMinute} -{" "}
                          {regTimeTable[1].endHour}:{regTimeTable[1].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[2].startHour}:
                          {regTimeTable[2].startMinute} -{" "}
                          {regTimeTable[2].endHour}:{regTimeTable[2].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[3].startHour}:
                          {regTimeTable[3].startMinute} -{" "}
                          {regTimeTable[3].endHour}:{regTimeTable[3].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[4].startHour}:
                          {regTimeTable[4].startMinute} -{" "}
                          {regTimeTable[4].endHour}:{regTimeTable[4].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          {regTimeTable[5].startHour}:
                          {regTimeTable[5].startMinute} -{" "}
                          {regTimeTable[5].endHour}:{regTimeTable[5].endMinute}
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.75)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[0].startHour}:
                          {regTimeTable[0].startMinute} -{" "}
                          {regTimeTable[0].endHour}:{regTimeTable[0].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[1].startHour}:
                          {regTimeTable[1].startMinute} -{" "}
                          {regTimeTable[1].endHour}:{regTimeTable[1].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[2].startHour}:
                          {regTimeTable[2].startMinute} -{" "}
                          {regTimeTable[2].endHour}:{regTimeTable[2].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[3].startHour}:
                          {regTimeTable[3].startMinute} -{" "}
                          {regTimeTable[3].endHour}:{regTimeTable[3].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[4].startHour}:
                          {regTimeTable[4].startMinute} -{" "}
                          {regTimeTable[4].endHour}:{regTimeTable[4].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          {regTimeTable[5].startHour}:
                          {regTimeTable[5].startMinute} -{" "}
                          {regTimeTable[5].endHour}:{regTimeTable[5].endMinute}
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.5)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[0].startHour}:
                          {regTimeTable[0].startMinute} -{" "}
                          {regTimeTable[0].endHour}:{regTimeTable[0].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[1].startHour}:
                          {regTimeTable[1].startMinute} -{" "}
                          {regTimeTable[1].endHour}:{regTimeTable[1].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[2].startHour}:
                          {regTimeTable[2].startMinute} -{" "}
                          {regTimeTable[2].endHour}:{regTimeTable[2].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[3].startHour}:
                          {regTimeTable[3].startMinute} -{" "}
                          {regTimeTable[3].endHour}:{regTimeTable[3].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[4].startHour}:
                          {regTimeTable[4].startMinute} -{" "}
                          {regTimeTable[4].endHour}:{regTimeTable[4].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          {regTimeTable[5].startHour}:
                          {regTimeTable[5].startMinute} -{" "}
                          {regTimeTable[5].endHour}:{regTimeTable[5].endMinute}
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.35)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[0].startHour}:
                          {regTimeTable[0].startMinute} -{" "}
                          {regTimeTable[0].endHour}:{regTimeTable[0].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[1].startHour}:
                          {regTimeTable[1].startMinute} -{" "}
                          {regTimeTable[1].endHour}:{regTimeTable[1].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[2].startHour}:
                          {regTimeTable[2].startMinute} -{" "}
                          {regTimeTable[2].endHour}:{regTimeTable[2].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[3].startHour}:
                          {regTimeTable[3].startMinute} -{" "}
                          {regTimeTable[3].endHour}:{regTimeTable[3].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[4].startHour}:
                          {regTimeTable[4].startMinute} -{" "}
                          {regTimeTable[4].endHour}:{regTimeTable[4].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          {regTimeTable[5].startHour}:
                          {regTimeTable[5].startMinute} -{" "}
                          {regTimeTable[5].endHour}:{regTimeTable[5].endMinute}
                        </div>
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.25)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[0].startHour}:
                          {regTimeTable[0].startMinute} -{" "}
                          {regTimeTable[0].endHour}:{regTimeTable[0].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[1].startHour}:
                          {regTimeTable[1].startMinute} -{" "}
                          {regTimeTable[1].endHour}:{regTimeTable[1].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[2].startHour}:
                          {regTimeTable[2].startMinute} -{" "}
                          {regTimeTable[2].endHour}:{regTimeTable[2].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[3].startHour}:
                          {regTimeTable[3].startMinute} -{" "}
                          {regTimeTable[3].endHour}:{regTimeTable[3].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          {regTimeTable[4].startHour}:
                          {regTimeTable[4].startMinute} -{" "}
                          {regTimeTable[4].endHour}:{regTimeTable[4].endMinute}
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          {regTimeTable[5].startHour}:
                          {regTimeTable[5].startMinute} -{" "}
                          {regTimeTable[5].endHour}:{regTimeTable[5].endMinute}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-100" style={{ flex: 1 }}>
                    <div
                      className="custom-h3 d-flex justify-content-center align-items-center border-bottom border-black"
                      style={{ background: "#FFD786", height: "5%" }}
                    >
                      วิชา
                    </div>
                    <div
                      className="w-100 d-flex flex-column"
                      style={{ height: "95%" }}
                    >
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{ height: "20%", background: "#BBBBBB" }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon0830}
                            onChange={(e) => setRegMon0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon0930}
                            onChange={(e) => setRegMon0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon1030}
                            onChange={(e) => setRegMon1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon1230}
                            onChange={(e) => setRegMon1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon1330}
                            onChange={(e) => setRegMon1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regMon1430}
                            onChange={(e) => setRegMon1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.75)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue0830}
                            onChange={(e) => setRegTue0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue0930}
                            onChange={(e) => setRegTue0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue1030}
                            onChange={(e) => setRegTue1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue1230}
                            onChange={(e) => setRegTue1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue1330}
                            onChange={(e) => setRegTue1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regTue1430}
                            onChange={(e) => setRegTue1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.5)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed0830}
                            onChange={(e) => setRegWed0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed0930}
                            onChange={(e) => setRegWed0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed1030}
                            onChange={(e) => setRegWed1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed1230}
                            onChange={(e) => setRegWed1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed1330}
                            onChange={(e) => setRegWed1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regWed1430}
                            onChange={(e) => setRegWed1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                      </div>
                      <div
                        className="border-bottom border-black d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.35)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu0830}
                            onChange={(e) => setRegThu0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu0930}
                            onChange={(e) => setRegThu0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu1030}
                            onChange={(e) => setRegThu1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu1230}
                            onChange={(e) => setRegThu1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu1330}
                            onChange={(e) => setRegThu1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regThu1430}
                            onChange={(e) => setRegThu1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{
                          height: "20%",
                          background: "rgba(187, 187, 187, 0.25)",
                        }}
                      >
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri0830}
                            onChange={(e) => setRegFri0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri0930}
                            onChange={(e) => setRegFri0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri1030}
                            onChange={(e) => setRegFri1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri1230}
                            onChange={(e) => setRegFri1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri1330}
                            onChange={(e) => setRegFri1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-start"
                            value={regFri1430}
                            onChange={(e) => setRegFri1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            {subjectOptions}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="save-btn w-25 custom-h3 btn rounded-pill border-0 text-light"
                >
                  บันทึก
                </button>
              </form>
            </div>
          </div>
          <div className="p-2" style={{ width: "60%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                ตัวอย่าง
              </div>
              <div className="d-flex w-100 h-50 timetable-box">
                {/* ฝั่งซ้าย */}
                <div className="h-100 d-flex" style={{ width: "49.5%" }}>
                  {/* แถวชื่อวัน */}
                  <div
                    className="h-100 border-end border-black"
                    style={{ width: "25%" }}
                  >
                    <div
                      className="border-bottom border-black time-header"
                      style={{ height: "10%" }}
                    ></div>
                    <div
                      className="d-flex flex-column"
                      style={{ height: "90%" }}
                    >
                      {["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"].map(
                        (day, i) => (
                          <div
                            key={i}
                            className="timetable-cell day-header"
                            style={{ height: "20%" }}
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* คาบเช้า */}
                  {[
                    {
                      time: `${regTimeTable[0].startHour}:${regTimeTable[0].startMinute} - ${regTimeTable[0].endHour}:${regTimeTable[0].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon0830),
                        getSubjectDisplay(regTue0830),
                        getSubjectDisplay(regWed0830),
                        getSubjectDisplay(regThu0830),
                        getSubjectDisplay(regFri0830),
                      ],
                    },
                    {
                      time: `${regTimeTable[1].startHour}:${regTimeTable[1].startMinute} - ${regTimeTable[1].endHour}:${regTimeTable[1].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon0930),
                        getSubjectDisplay(regTue0930),
                        getSubjectDisplay(regWed0930),
                        getSubjectDisplay(regThu0930),
                        getSubjectDisplay(regFri0930),
                      ],
                    },
                    {
                      time: `${regTimeTable[2].startHour}:${regTimeTable[2].startMinute} - ${regTimeTable[2].endHour}:${regTimeTable[2].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon1030),
                        getSubjectDisplay(regTue1030),
                        getSubjectDisplay(regWed1030),
                        getSubjectDisplay(regThu1030),
                        getSubjectDisplay(regFri1030),
                      ],
                    },
                  ].map((col, i) => (
                    <div
                      key={i}
                      className="h-100 border-end border-black"
                      style={{ width: "25%" }}
                    >
                      <div
                        className="timetable-cell time-header"
                        style={{ height: "10%" }}
                      >
                        {col.time}
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{ height: "90%" }}
                      >
                        {col.data.map((item, j) => (
                          <div
                            key={j}
                            className="timetable-cell"
                            style={{ height: "20%" }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* กลาง = พัก */}
                <div
                  className="d-flex justify-content-center align-items-center h-100 border-start border-end border-black"
                  style={{ width: "5%" }}
                >
                  <div
                    className="w-0 h-0"
                    style={{
                      transform: "rotate(-90deg)",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    พักกลางวัน
                  </div>
                </div>

                {/* ฝั่งขวา */}
                <div className="h-100 d-flex" style={{ width: "49.5%" }}>
                  {/* คาบบ่าย */}
                  {[
                    {
                      time: `${regTimeTable[3].startHour}:${regTimeTable[3].startMinute} - ${regTimeTable[3].endHour}:${regTimeTable[3].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon1230),
                        getSubjectDisplay(regTue1230),
                        getSubjectDisplay(regWed1230),
                        getSubjectDisplay(regThu1230),
                        getSubjectDisplay(regFri1230),
                      ],
                    },
                    {
                      time: `${regTimeTable[4].startHour}:${regTimeTable[4].startMinute} - ${regTimeTable[4].endHour}:${regTimeTable[4].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon1330),
                        getSubjectDisplay(regTue1330),
                        getSubjectDisplay(regWed1330),
                        getSubjectDisplay(regThu1330),
                        getSubjectDisplay(regFri1330),
                      ],
                    },
                    {
                      time: `${regTimeTable[5].startHour}:${regTimeTable[5].startMinute} - ${regTimeTable[5].endHour}:${regTimeTable[5].endMinute}`,
                      data: [
                        getSubjectDisplay(regMon1430),
                        getSubjectDisplay(regTue1430),
                        getSubjectDisplay(regWed1430),
                        getSubjectDisplay(regThu1430),
                        getSubjectDisplay(regFri1430),
                      ],
                    },
                    { time: "", data: ["", "", "", "", ""] },
                  ].map((col, i) => (
                    <div
                      key={i}
                      className="h-100 border-end border-black"
                      style={{ width: "25%" }}
                    >
                      <div
                        className="timetable-cell time-header"
                        style={{ height: "10%" }}
                      >
                        {col.time}
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{ height: "90%" }}
                      >
                        {col.data.map((item, j) => (
                          <div
                            key={j}
                            className="timetable-cell"
                            style={{ height: "20%" }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StudentTableManagement;
