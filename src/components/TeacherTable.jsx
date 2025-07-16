import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useTeacherTable } from "../context/TeacherTableContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "../assets/logo.png";

function TeacherTable() {
  const { teacherTableData } = useTeacherTable();
  const { user, userRole } = useUserAuth();

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
      <Navbar />

      <div className="p-3 page-detail">
        <div
          className="page-detail-box"
          style={{ background: "#BBBBBB" }}
        >
          <div className="custom-h2 timetable-header">ตารางสอน</div>
          <div className="d-flex align-items-center ps-2 gap-2 mb-3">
            ตัวเลือก
            <div className="custom-select">
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
            <div className="custom-select">
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
          <div className="timetable-box">
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
