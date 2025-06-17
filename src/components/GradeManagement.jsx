import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { db } from "../firebase";
import logo from "../assets/logo.png";

function GradeManagement() {
  const [students, setStudents] = useState([]);
  const [studentClass, setStudentClass] = useState("ประถมศึกษาปีที่ 1");

  const { logOut, user, firstName, lastName, userRole } = useUserAuth();
  const { profileData } = useUserProfile();
  const navigate = useNavigate();

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
    if (!profileData || profileData.length === 0) return;

    const loadStudents = profileData.filter(
      (profile) => profile.position === "นักเรียน"
    );

    setStudents(loadStudents);
    console.log("นักเรียนทั้งหมด:", loadStudents);
  }, [profileData]);

  const filteredData = students.filter(
    (item) => item.classLevel === studentClass
  );

  const handelEdit = async (id) => {
    try {
      navigate(`/grade-management/student?id=${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div style={{ background: "#BBBBBB" }}>
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
      <div className="p-4" style={{ height: "825px" }}>
        <div className="bg-white w-100 h-100">
          <div className="d-flex justify-content-center custom-h1 fw-bold p-3">
            จัดการคะแนนรายวิชา
          </div>
          <div className="custom-h2 d-flex align-items-center gap-4 p-3">
            ตัวเลือก
            <div className="custom-select">
              <select
                className="custom-h3 text-center"
                style={{ width: "200px", backgroundColor: "#BBBBBB" }}
                onChange={(e) => setStudentClass(e.target.value)}
              >
                <option value="ประถมศึกษาปีที่ 1">ประถมศึกษาปีที่ 1</option>
                <option value="ประถมศึกษาปีที่ 2">ประถมศึกษาปีที่ 2</option>
                <option value="ประถมศึกษาปีที่ 3">ประถมศึกษาปีที่ 3</option>
                <option value="ประถมศึกษาปีที่ 4">ประถมศึกษาปีที่ 4</option>
                <option value="ประถมศึกษาปีที่ 5">ประถมศึกษาปีที่ 5</option>
                <option value="ประถมศึกษาปีที่ 6">ประถมศึกษาปีที่ 6</option>
              </select>
            </div>
          </div>
          <div className="d-flex flex-column border border-black w-50 h-75 ms-3">
            <div
              className="d-flex"
              style={{
                borderBottom: "1px solid",
                backgroundColor: "#FFD786",
              }}
            >
              <div className="custom-h3 d-flex justify-content-center w-25">
                รหัสประจำตัว
              </div>
              <div
                className="custom-h3 d-flex justify-content-center w-50"
                style={{ borderLeft: "1px solid" }}
              >
                ชื่อ-สกุล
              </div>
              <div
                className="custom-h3 d-flex justify-content-center w-25"
                style={{ borderLeft: "1px solid" }}
              >
                ตัวเลือก
              </div>
            </div>
            <div className="d-flex flex-column overflow-auto">
              {[...filteredData]
                .sort((a, b) => a.email.localeCompare(b.email))
                .map((item, index) => (
                  <div className="d-flex" key={index}>
                    <div className="d-flex align-items-center w-25">
                      <div
                        className="mt-1 mb-1 p-1 w-100 text-center"
                        style={{ backgroundColor: "#BBBBBB" }}
                      >
                        {item.email?.replace("@gmail.com", "")}
                      </div>
                    </div>
                    <div
                      className="d-flex align-items-center w-50"
                      style={{ borderLeft: "1px solid" }}
                    >
                      <div
                        className="mt-1 mb-1 p-1 w-100 text-center"
                        style={{ backgroundColor: "#EFEFEF" }}
                      >
                        {item.firstName} {item.lastName}
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-center p-1 w-25"
                      style={{ width: "100px", borderLeft: "1px solid" }}
                    >
                      <button
                        className="p-1 btn btn-success"
                        style={{
                          width: "100px",
                          border: "#61C554",
                          borderRadius: "20px",
                          background: "#61C554",
                        }}
                        onClick={() => handelEdit(item.id)}
                      >
                        แก้ไข
                      </button>
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

export default GradeManagement;
