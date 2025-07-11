/* --- Updated AdminHome.jsx with improved UX/UI --- */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import logo from "../assets/logo.png";

function AdminHome() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { logOut, firstName, lastName, user } = useUserAuth();
  const navigate = useNavigate();

  const menuRef1 = useRef();
  const menuRef2 = useRef();
  const menuRef3 = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef1.current.contains(e.target)) setOpen1(false);
      if (!menuRef2.current.contains(e.target)) setOpen2(false);
      if (!menuRef3.current.contains(e.target)) setOpen3(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="screen">
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
              <Link to={`/profile?id=${user.uid}`}>ข้อมูลส่วนตัว</Link>
              <Link to="/usermanagement">จัดการข้อมูลผู้ใช้</Link>
              <Link to="/subjects-management">จัดการรายวิชา</Link>
              <Link to="/time-table-management">จัดการตารางเวลา</Link>
              <Link to="/student-table-management">จัดการตารางเรียน</Link>
              <Link to="/teacher-table-management">จัดการตารางสอน</Link>
            </div>
          </div>

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

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="custom-h1 fw-bold">แดชบอร์ด</h2>
          <hr />
          <p className="custom-h5">เลือกเมนูเพื่อไปยังหน้าต่าง ๆ ของระบบ</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/usermanagement" className="dashboard-card custom-h3">
            <img src="/group.png" alt="group" className="dashboard-icon" />
            จัดการข้อมูลผู้ใช้
          </Link>
          <Link to="/subjects-management" className="dashboard-card custom-h3">
            <img
              src="/text-books.png"
              alt="text-books"
              className="dashboard-icon"
            />
            จัดการรายวิชา
          </Link>
          <Link
            to="/time-table-management"
            className="dashboard-card custom-h3"
          >
            <img src="/clock.png" alt="clock" className="dashboard-icon" />
            จัดการตารางเวลา
          </Link>
          <Link
            to="/student-table-management"
            className="dashboard-card custom-h3"
          >
            <img src="/weekly.png" alt="weekly" className="dashboard-icon" />
            จัดการตารางเรียน
          </Link>
          <Link
            to="/teacher-table-management"
            className="dashboard-card custom-h3"
          >
            <img
              src="/training.png"
              alt="training"
              className="dashboard-icon"
            />
            จัดการตารางสอน
          </Link>
          <Link
            to="/school-record-management"
            className="dashboard-card custom-h3"
          >
            <img
              src="/education.png"
              alt="education"
              className="dashboard-icon"
            />
            จัดการผลการเรียน
          </Link>
        </div>
      </div>

      <div className="footer">
        <div className="custom-h3">ติดต่อเรา: admin@school.ac.th</div>
      </div>
    </div>
  );
}

export default AdminHome;
