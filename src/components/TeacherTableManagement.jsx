import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { useTeacherTable } from "../context/TeacherTableContext";
import { Form, Alert, Button } from "react-bootstrap";
import { db } from "../firebase";
import { updateDoc, setDoc, doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";

function TeacherTableManagement() {
  const [regTeacherName, setRegTeacherName] = useState("");
  const [regTeacherID, setRegTeacherID] = useState("");

  const [teacherTable, setTeacherTable] = useState([]);

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

  const [error, setError] = useState("");

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  const { firstName, lastName, logOut } = useUserAuth();
  const { profileData } = useUserProfile();
  const { teacherTableData } = useTeacherTable();

  useEffect(() => {
    if (!profileData) return;

    const loadTeacher = profileData.find((item) => item.position === "ครู");
    if (loadTeacher) {
      setRegTeacherName(loadTeacher.firstName + " " + loadTeacher.lastName);
      setRegTeacherID(loadTeacher.id);

      console.log("Teacher:", loadTeacher);
    }
  }, [profileData]);

  useEffect(() => {
    if (!teacherTableData) return;

    const table = teacherTableData.find(
      (item) => item.id === regTeacherID + regAcademicYear + "_" + regSemester
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
  }, [teacherTableData, regTeacherID, regAcademicYear, regSemester]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const teacherID = regTeacherID;

    if (!teacherID) {
      setError("กรุณาเลือกให้ถูกต้อง");
      return;
    }

    try {
      const regTeacherTable = {
        teacherName: regTeacherName,
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
        doc(
          db,
          "teacher_table",
          teacherID + regAcademicYear + "_" + regSemester
        ),
        regTeacherTable
      );

      console.log("Data saved to FireStore!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

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
          <div ref={menuRef2}>
            <div
              className="menu-1"
              onClick={() => {
                setOpen2(!open2);
              }}
            >
              <div className="custom-h5">ทะเบียน</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g clipPath="url(#clip0_282_2287)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_282_2287">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className={`menu-1-dropdown ${open2 ? "active" : "inactive"}`}>
              <div className="custom-h5 d-flex flex-column align-items-end">
                <Link to={"/profile"} className="text-black">
                  ข้อมูลส่วนตัว
                </Link>
                <Link to={"/usermanagement"} className="text-black">
                  จัดการข้อมูลผู้ใช้
                </Link>
                <Link to={"/student-table-management"} className="text-black">
                  จัดการตารางเรียน
                </Link>
                <Link to={"/teacher-table-management"} className="text-black">
                  จัดการตารางสอน
                </Link>
              </div>
            </div>
          </div>

          <div ref={menuRef3}>
            <div
              className="menu-2"
              onClick={() => {
                setOpen3(!open3);
              }}
            >
              <div className="custom-h5">ประมวณผลการเรียน</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g clipPath="url(#clip0_282_2287)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_282_2287">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              className={`menu-2-dropdown ${
                open3 ? "active" : "inactive"
              } d-flex justify-content-end align-items-center`}
            >
              <div className="custom-h5">
                <Link to="/school-record-management" className="text-black">
                  จัดการผลการเรียน
                </Link>
              </div>
            </div>
          </div>

          <div className="menu-3">
            <div className="custom-h5">คำร้อง</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <g clipPath="url(#clip0_282_2287)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_282_2287">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        <div className="dropdown-container" ref={menuRef1}>
          <div
            className="dropdown-trigger"
            onClick={() => {
              setOpen1(!open1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="21"
              viewBox="0 0 17 21"
              fill="none"
            >
              <g clipPath="url(#clip0_1_313)">
                <path
                  d="M0.5 21C0.5 18.8783 1.34285 16.8434 2.84315 15.3431C4.34344 13.8429 6.37827 13 8.5 13C10.6217 13 12.6566 13.8429 14.1569 15.3431C15.6571 16.8434 16.5 18.8783 16.5 21H0.5ZM8.5 12C5.185 12 2.5 9.315 2.5 6C2.5 2.685 5.185 0 8.5 0C11.815 0 14.5 2.685 14.5 6C14.5 9.315 11.815 12 8.5 12Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_313">
                  <rect
                    width="16"
                    height="21"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <div className="custom-h5">{firstName}</div>
          </div>

          <form>
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
              <div className="custom-h5">
                {firstName} {lastName}
              </div>
              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
              >
                <div className="custom-h6">ออกจากระบบ</div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="p-2" style={{ height: "1000px" }}>
        <div className="d-flex h-100">
          <div className="p-2" style={{ width: "40%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                จัดการตารางสอน
              </div>
              <form
                onSubmit={handleSave}
                className="d-flex flex-column align-items-center p-2 gap-2 h-100"
                style={{ backgroundColor: "white" }}
              >
                <div className="d-flex align-items-center ps-2 gap-2 w-100">
                  ตัวเลือก
                  <div class="custom-select">
                    <select
                      className="text-center"
                      style={{ width: "300px" }}
                      value={regTeacherID}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setRegTeacherID(selectedId);

                        const selectedProfile = profileData.find(
                          (profile) => profile.id === selectedId
                        );

                        if (selectedProfile) {
                          setRegTeacherName(
                            `${selectedProfile.firstName} ${selectedProfile.lastName}`
                          );
                        }
                      }}
                    >
                      <option value="" disabled>
                        -- คุณครู --
                      </option>
                      {profileData &&
                        profileData
                          .filter((profile) => profile.position === "ครู")
                          .map((profile, index) => (
                            <option key={index} value={profile.id}>
                              {`${profile.firstName} ${profile.lastName}`}
                            </option>
                          ))}
                    </select>
                  </div>
                  <div class="custom-select">
                    <select
                      className="text-center"
                      style={{ width: "180px" }}
                      value={regAcademicYear}
                      onChange={(e) =>
                        setRegAcademicYear(Number(e.target.value))
                      }
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
                          08:30 - 09:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          09:30 - 10:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          10:30 - 11:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          12:30 - 13:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          13:30 - 14:30
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          14:30 - 15:30
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
                          08:30 - 09:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          09:30 - 10:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          10:30 - 11:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          12:30 - 13:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          13:30 - 14:30
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          14:30 - 15:30
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
                          08:30 - 09:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          09:30 - 10:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          10:30 - 11:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          12:30 - 13:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          13:30 - 14:30
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          14:30 - 15:30
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
                          08:30 - 09:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          09:30 - 10:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          10:30 - 11:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          12:30 - 13:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          13:30 - 14:30
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          14:30 - 15:30
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
                          08:30 - 09:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          09:30 - 10:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          10:30 - 11:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          12:30 - 13:30
                        </div>
                        <div className="custom-h6 flex-fill border-bottom border-black d-flex justify-content-center align-items-center">
                          13:30 - 14:30
                        </div>
                        <div className="custom-h6 flex-fill d-flex justify-content-center align-items-center">
                          14:30 - 15:30
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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
                            <option value="ประถมศึกษาปีที่ 1">
                              ประถมศึกษาปีที่ 1
                            </option>
                            <option value="ประถมศึกษาปีที่ 2">
                              ประถมศึกษาปีที่ 2
                            </option>
                            <option value="ประถมศึกษาปีที่ 3">
                              ประถมศึกษาปีที่ 3
                            </option>
                            <option value="ประถมศึกษาปีที่ 4">
                              ประถมศึกษาปีที่ 4
                            </option>
                            <option value="ประถมศึกษาปีที่ 5">
                              ประถมศึกษาปีที่ 5
                            </option>
                            <option value="ประถมศึกษาปีที่ 6">
                              ประถมศึกษาปีที่ 6
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

      <div className="footer w-100">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default TeacherTableManagement;
