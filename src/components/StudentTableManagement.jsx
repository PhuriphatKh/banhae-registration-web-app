import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useStudentTable } from "../context/StudentTableContex";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import logo from "../assets/logo.png";
import { use } from "react";

function StudentTableManagement() {
  const { logOut, user, firstName, lastName, userRole } = useUserAuth();
  const { studentTableData } = useStudentTable();
  const navigate = useNavigate();

  const classTableIDs = {
    "ประถมศึกษาปีที่ 1": "j8AzXNhqKwCBoInfAt1f",
    "ประถมศึกษาปีที่ 2": "jehvrtW8WQnbgQUFpQ3A",
    "ประถมศึกษาปีที่ 3": "N0UMUb6jNC3f0bMjgEyZ",
    "ประถมศึกษาปีที่ 4": "kpSW5PxJ5xgxg3EEI7om",
    "ประถมศึกษาปีที่ 5": "Vr4gnaex3VvDpYpkSerq",
    "ประถมศึกษาปีที่ 6": "idKJQ8WN6fLccjCX5RCK",
  };
  const classTable = [
    "ประถมศึกษาปีที่ 1",
    "ประถมศึกษาปีที่ 2",
    "ประถมศึกษาปีที่ 3",
    "ประถมศึกษาปีที่ 4",
    "ประถมศึกษาปีที่ 5",
    "ประถมศึกษาปีที่ 6",
  ];
  const academicYear = [2567, 2568];
  const semester = [1, 2];

  const [regAcademicYear, setRegAcademicYear] = useState(2567);
  const [regSemester, setRegSemester] = useState(1);

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

  const [regClassLevel, setRegClassLevel] = useState("ประถมศึกษาปีที่ 1");

  const [regTimeTable, setRegTimeTable] = useState([
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
  ]);

  const [error, setError] = useState("");

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  const tableID = classTableIDs[regClassLevel] || "";

  // โหลดข้อมูลตารางเรียน
  const table = studentTableData.find(
    (item) => item.id === tableID + regAcademicYear + "_" + regSemester
  );

  // set ข้อมูลตารางเรียน
  useEffect(() => {
    if (table) {
      setRegMon0830(table.mon0830);
      setRegMon0930(table.mon0930);
      setRegMon1030(table.mon1030);
      setRegMon1230(table.mon1230);
      setRegMon1330(table.mon1330);
      setRegMon1430(table.mon1430);

      setRegTue0830(table.tue0830);
      setRegTue0930(table.tue0930);
      setRegTue1030(table.tue1030);
      setRegTue1230(table.tue1230);
      setRegTue1330(table.tue1330);
      setRegTue1430(table.tue1430);

      setRegWed0830(table.wed0830);
      setRegWed0930(table.wed0930);
      setRegWed1030(table.wed1030);
      setRegWed1230(table.wed1230);
      setRegWed1330(table.wed1330);
      setRegWed1430(table.wed1430);

      setRegThu0830(table.thu0830);
      setRegThu0930(table.thu0930);
      setRegThu1030(table.thu1030);
      setRegThu1230(table.thu1230);
      setRegThu1330(table.thu1330);
      setRegThu1430(table.thu1430);

      setRegFri0830(table.fri0830);
      setRegFri0930(table.fri0930);
      setRegFri1030(table.fri1030);
      setRegFri1230(table.fri1230);
      setRegFri1330(table.fri1330);
      setRegFri1430(table.fri1430);

      console.log("📋 TeacherTable:", table);
    } else {
      const setAll = (setter) => setter("-");

      [
        setRegMon0830,
        setRegMon0930,
        setRegMon1030,
        setRegMon1230,
        setRegMon1330,
        setRegMon1430,
        setRegTue0830,
        setRegTue0930,
        setRegTue1030,
        setRegTue1230,
        setRegTue1330,
        setRegTue1430,
        setRegWed0830,
        setRegWed0930,
        setRegWed1030,
        setRegWed1230,
        setRegWed1330,
        setRegWed1430,
        setRegThu0830,
        setRegThu0930,
        setRegThu1030,
        setRegThu1230,
        setRegThu1330,
        setRegThu1430,
        setRegFri0830,
        setRegFri0930,
        setRegFri1030,
        setRegFri1230,
        setRegFri1330,
        setRegFri1430,
      ].forEach(setAll);

      console.log("⚠️ ไม่พบตารางเวลา → เซตเป็น '-'");
    }
  }, [table, regClassLevel, regAcademicYear, regSemester]);

  // dropdown config
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef1.current.contains(e.target)) {
        setOpen1(false);
        console.log(menuRef1.current);
      }

      if (!menuRef2.current.contains(e.target)) {
        setOpen2(false);
        console.log(menuRef2.current);
      }

      if (!menuRef3.current.contains(e.target)) {
        setOpen3(false);
        console.log(menuRef3.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  //save
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const tableID = classTableIDs[regClassLevel] || "";

    if (!tableID) {
      setError("กรุณาเลือกระดับชั้นเรียนให้ถูกต้อง");
      return;
    }

    try {
      const studentTable = {
        classLevel: regClassLevel,
        academicYear: regAcademicYear,
        semester: regSemester,
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

      await setDoc(
        doc(db, "student_table", tableID + regAcademicYear + "_" + regSemester),
        studentTable
      );

      console.log("Data saved to FireStore!");
    } catch (error) {
      console.log(error);
    }
  };

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

  return (
    <div style={{ backgroundColor: "#BBBBBB" }}>
      <div className="nav">
        <div className="logo-container">
          <div className="logo-img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="47"
              height="46"
              viewBox="0 0 47 46"
              fill="none"
            >
              <ellipse cx="23.5" cy="23" rx="23.5" ry="23" fill="white" />
            </svg>
            <img src={logo} alt="logo" className="w-100 h-100" />
          </div>
          <div className="custom-h2">โรงเรียนบ้านแฮะ</div>
        </div>

        <div className="menu-container">
          {/* เมนู ทะเบียน */}
          <div className="dropdown" ref={menuRef2}>
            <div className="dropdown-trigger" onClick={() => setOpen2(!open2)}>
              <div className="custom-h5">ทะเบียน</div>
              <svg
                className={`dropdown-icon ${open2 ? "rotate" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <div
              className={`dropdown-content ${open2 ? "active" : "inactive"}`}
            >
              <Link to="/profile">ข้อมูลส่วนตัว</Link>
              <Link to="/usermanagement">จัดการข้อมูลผู้ใช้</Link>
              <Link to="/subjects-management">จัดการรายวิชา</Link>
              <Link to="/time-table-management">จัดการตารางเวลา</Link>
              <Link to="/student-table-management">จัดการตารางเรียน</Link>
              <Link to="/teacher-table-management">จัดการตารางสอน</Link>
            </div>
          </div>

          {/* เมนู ประมวลผล */}
          <div className="dropdown" ref={menuRef3}>
            <div className="dropdown-trigger" onClick={() => setOpen3(!open3)}>
              <div className="custom-h5">ประมวลผลการเรียน</div>
              <svg
                className={`dropdown-icon ${open3 ? "rotate" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <div
              className={`dropdown-content ${open3 ? "active" : "inactive"}`}
            >
              <Link to="/school-record-management">จัดการผลการเรียน</Link>
            </div>
          </div>

          {/* เมนู คำร้อง */}
          <div className="dropdown">
            <div className="dropdown-trigger">
              <div className="custom-h5">คำร้อง</div>
              <svg
                className="dropdown-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* โปรไฟล์ */}
        <div className="dropdown-container" ref={menuRef1}>
          <div className="dropdown-trigger" onClick={() => setOpen1(!open1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 22C4 19.8783 4.84285 17.8434 6.34315 16.3431C7.84344 14.8429 9.87827 14 12 14C14.1217 14 16.1566 14.8429 17.6569 16.3431C19.1571 17.8434 20 19.8783 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"
                fill="black"
              />
            </svg>
            <div className="custom-h5">{firstName}</div>
          </div>
          <div className={`dropdown-menu-2 ${open1 ? "active" : "inactive"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 22C4 19.8783 4.84285 17.8434 6.34315 16.3431C7.84344 14.8429 9.87827 14 12 14C14.1217 14 16.1566 14.8429 17.6569 16.3431C19.1571 17.8434 20 19.8783 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"
                fill="black"
              />
            </svg>
            <div className="custom-h4">
              {firstName} {lastName}
            </div>
            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              <div className="custom-h5">ออกจากระบบ</div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-2" style={{ height: "1000px" }}>
        <div className="d-flex h-100">
          <div className="p-2" style={{ width: "40%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                จัดการตารางเรียน
              </div>
              <form
                onSubmit={handleSave}
                className="d-flex flex-column align-items-center p-2 gap-2 h-100"
                style={{ backgroundColor: "white" }}
              >
                <div className="d-flex align-items-center ps-2 gap-2 w-100">
                  ตัวเลือก
                  <div className="custom-select">
                    <select
                      className="text-center"
                      style={{ width: "200px", backgroundColor: "#BBBBBB" }}
                      onChange={(e) => setRegClassLevel(e.target.value)}
                    >
                      <option value="" disabled>
                        -- เลือกชั้นเรียน --
                      </option>
                      {classTable.map((classItem) => (
                        <option key={classItem} value={classItem}>
                          {classItem}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="custom-select">
                    <select
                      className="text-center"
                      style={{ width: "200px" }}
                      value={regAcademicYear}
                      onChange={(e) =>
                        setRegAcademicYear(Number(e.target.value))
                      }
                    >
                      <option value="" disabled>
                        -- ปีการศึกษา --
                      </option>
                      {academicYear.map((year) => (
                        <option key={year} value={year}>
                          ปีการศึกษา {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="custom-select">
                    <select
                      className="text-center"
                      style={{ width: "200px" }}
                      value={regSemester}
                      onChange={(e) => setRegSemester(Number(e.target.value))}
                    >
                      <option value="" disabled>
                        -- ภาคเรียนที่ --
                      </option>
                      {semester.map((sem) => (
                        <option key={sem} value={sem}>
                          ภาคเรียนที่ {sem}
                        </option>
                      ))}
                    </select>
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
                            className="text-center"
                            value={regMon0830}
                            onChange={(e) => setRegMon0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regMon0930}
                            onChange={(e) => setRegMon0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regMon1030}
                            onChange={(e) => setRegMon1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regMon1230}
                            onChange={(e) => setRegMon1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regMon1330}
                            onChange={(e) => setRegMon1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regMon1430}
                            onChange={(e) => setRegMon1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
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
                            className="text-center"
                            value={regTue0830}
                            onChange={(e) => setRegTue0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regTue0930}
                            onChange={(e) => setRegTue0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regTue1030}
                            onChange={(e) => setRegTue1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regTue1230}
                            onChange={(e) => setRegTue1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regTue1330}
                            onChange={(e) => setRegTue1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regTue1430}
                            onChange={(e) => setRegTue1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
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
                            className="text-center"
                            value={regWed0830}
                            onChange={(e) => setRegWed0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regWed0930}
                            onChange={(e) => setRegWed0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regWed1030}
                            onChange={(e) => setRegWed1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regWed1230}
                            onChange={(e) => setRegWed1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regWed1330}
                            onChange={(e) => setRegWed1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regWed1430}
                            onChange={(e) => setRegWed1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
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
                            className="text-center"
                            value={regThu0830}
                            onChange={(e) => setRegThu0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regThu0930}
                            onChange={(e) => setRegThu0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regThu1030}
                            onChange={(e) => setRegThu1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regThu1230}
                            onChange={(e) => setRegThu1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regThu1330}
                            onChange={(e) => setRegThu1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regThu1430}
                            onChange={(e) => setRegThu1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
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
                            className="text-center"
                            value={regFri0830}
                            onChange={(e) => setRegFri0830(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regFri0930}
                            onChange={(e) => setRegFri0930(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regFri1030}
                            onChange={(e) => setRegFri1030(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regFri1230}
                            onChange={(e) => setRegFri1230(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regFri1330}
                            onChange={(e) => setRegFri1330(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
                          </select>
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          <select
                            className="text-center"
                            value={regFri1430}
                            onChange={(e) => setRegFri1430(e.target.value)}
                          >
                            <option value="-">-</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                            <option value="ลูกเสือ-เนตรนารี">
                              ลูกเสือ-เนตรนารี
                            </option>
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
                        regMon0830,
                        regTue0830,
                        regWed0830,
                        regThu0830,
                        regFri0830,
                      ],
                    },
                    {
                      time: `${regTimeTable[1].startHour}:${regTimeTable[1].startMinute} - ${regTimeTable[1].endHour}:${regTimeTable[1].endMinute}`,
                      data: [
                        regMon0930,
                        regTue0930,
                        regWed0930,
                        regThu0930,
                        regFri0930,
                      ],
                    },
                    {
                      time: `${regTimeTable[2].startHour}:${regTimeTable[2].startMinute} - ${regTimeTable[2].endHour}:${regTimeTable[2].endMinute}`,
                      data: [
                        regMon1030,
                        regTue1030,
                        regWed1030,
                        regThu1030,
                        regFri1030,
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
                        regMon1230,
                        regTue1230,
                        regWed1230,
                        regThu1230,
                        regFri1230,
                      ],
                    },
                    {
                      time: `${regTimeTable[4].startHour}:${regTimeTable[4].startMinute} - ${regTimeTable[4].endHour}:${regTimeTable[4].endMinute}`,
                      data: [
                        regMon1330,
                        regTue1330,
                        regWed1330,
                        regThu1330,
                        regFri1330,
                      ],
                    },
                    {
                      time: `${regTimeTable[5].startHour}:${regTimeTable[5].startMinute} - ${regTimeTable[5].endHour}:${regTimeTable[5].endMinute}`,
                      data: [
                        regMon1430,
                        regTue1430,
                        regWed1430,
                        regThu1430,
                        regFri1430,
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

      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default StudentTableManagement;
