import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useTeacherTable } from "../context/TeacherTableContext";
import logo from "../assets/logo.png";

function TeacherTable() {
  const { teacherTableData } = useTeacherTable();
  const { logOut, user, firstName, lastName, userRole } = useUserAuth();

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

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

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

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!teacherTableData) return;

    const table = teacherTableData.find(
      (item) => item.id === user.uid + regAcademicYear + "_" + regSemester
    );
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

      console.log("TeacherTable:", table);
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
  }, [teacherTableData, user.uid, regAcademicYear, regSemester]);

  return (
    <div>
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

      {/* <div className="p-5" style={{ height: "825px" }}>
        <div className="d-flex flex-column w-100 h-100 gap-1">
          <div className="custom-h2 d-flex justify-content-center fw-bold">
            ตารางสอน
          </div>
          <div
            className="d-flex w-100 h-75 border border-black rounded"
            style={{
              backgroundColor: "#e0e0e0", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
              border: "1px solid #999", 
            }}
          >
            <div className="h-100 d-flex" style={{ width: "49.5%" }}>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="border-bottom border-black"
                  style={{ height: "10%" }}
                ></div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    จันทร์
                  </div>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    อังคาร
                  </div>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    พุธ
                  </div>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    พฤหัสบดี
                  </div>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ height: "20%" }}
                  >
                    ศุกร์
                  </div>
                </div>
              </div>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  08:30 - 09:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon0830}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue0830}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed0830}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center  flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu0830}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri0830}
                  </div>
                </div>
              </div>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  09:30 - 10:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon0930}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue0930}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed0930}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu0930}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri0930}
                  </div>
                </div>
              </div>
              <div className="h-100" style={{ width: "25%" }}>
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  10:30 - 11:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon1030}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue1030}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed1030}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu1030}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri1030}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="d-flex justify-content-center align-items-center h-100 border-start border-end border-black"
              style={{ width: "5%" }}
            >
              <div
                className="w-0 h-0"
                style={{
                  transform: "rotate(-90deg)",
                  whiteSpace: "nowrap",
                }}
              >
                พักกลางวัน
              </div>
            </div>
            <div className="h-100 d-flex" style={{ width: "49.5%" }}>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  12:30 - 13:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon1230}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue1230}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed1230}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu1230}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri1230}
                  </div>
                </div>
              </div>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  13:30 - 14:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon1330}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue1330}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed1330}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu1330}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri1330}
                  </div>
                </div>
              </div>
              <div
                className="h-100 border-end border-black"
                style={{ width: "25%" }}
              >
                <div
                  className="d-flex justify-content-center align-items-center border-bottom border-black"
                  style={{ height: "10%" }}
                >
                  14:30 - 15:30
                </div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regMon1430}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regTue1430}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regWed1430}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  >
                    {regThu1430}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "20%" }}
                  >
                    {regFri1430}
                  </div>
                </div>
              </div>
              <div className="h-100" style={{ width: "25%" }}>
                <div
                  className="border-bottom border-black"
                  style={{ height: "10%" }}
                ></div>
                <div className="d-flex flex-column" style={{ height: "90%" }}>
                  <div
                    className="d-flex flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  ></div>
                  <div
                    className="d-flex flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  ></div>
                  <div
                    className="d-flex flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  ></div>
                  <div
                    className="d-flex flex-column border-bottom border-black"
                    style={{ height: "20%" }}
                  ></div>
                  <div
                    className="d-flex flex-column"
                    style={{ height: "20%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="p-3" style={{ height: "825px" }}>
        <div
          className="d-flex flex-column w-100 h-100 p-4 rounded"
          style={{ background: "#BBBBBB" }}
        >
          <div className="custom-h2 timetable-header">ตารางสอน</div>
          <div className="d-flex align-items-center ps-2 gap-2 mb-3">
            ตัวเลือก
            <div class="custom-select">
              <select
                className="text-center"
                style={{ width: "180px" }}
                value={regAcademicYear}
                onChange={(e) => setRegAcademicYear(Number(e.target.value))}
              >
                <option value="" disabled>
                  -- ปีการศึกษา --
                </option>
                <option value="2567">ปีการศึกษา 2567</option>
                <option value="2568">ปีการศึกษา 2568</option>
              </select>
            </div>
            <div class="custom-select">
              <select
                className="text-center"
                style={{ width: "150px" }}
                value={regSemester}
                onChange={(e) => setRegSemester(Number(e.target.value))}
              >
                <option value="" disabled>
                  -- ภาคเรียนที่ --
                </option>
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
              </select>
            </div>
          </div>
          <div className="d-flex w-100 h-75 timetable-box">
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
                <div className="d-flex flex-column" style={{ height: "90%" }}>
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
                  time: "08:30 - 09:30",
                  data: [
                    regMon0830,
                    regTue0830,
                    regWed0830,
                    regThu0830,
                    regFri0830,
                  ],
                },
                {
                  time: "09:30 - 10:30",
                  data: [
                    regMon0930,
                    regTue0930,
                    regWed0930,
                    regThu0930,
                    regFri0930,
                  ],
                },
                {
                  time: "10:30 - 11:30",
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
                  <div className="d-flex flex-column" style={{ height: "90%" }}>
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
                  time: "12:30 - 13:30",
                  data: [
                    regMon1230,
                    regTue1230,
                    regWed1230,
                    regThu1230,
                    regFri1230,
                  ],
                },
                {
                  time: "13:30 - 14:30",
                  data: [
                    regMon1330,
                    regTue1330,
                    regWed1330,
                    regThu1330,
                    regFri1330,
                  ],
                },
                {
                  time: "14:30 - 15:30",
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
                  <div className="d-flex flex-column" style={{ height: "90%" }}>
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

      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default TeacherTable;
