import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";

function Profile() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { logOut, user, firstName, lastName, userRole } = useUserAuth();
  const { profileData } = useUserProfile();
  const navigate = useNavigate();

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

  return (
    <div className="profile-page">
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
      <div className="profile-detail">
        <div
          className="d-flex flex-column align-items-center p-3 w-100"
          style={{ backgroundColor: "white", height: "fit-content" }}
        >
          <div>ข้อมูลส่วนตัว</div>
          <div className="profile-basic-info">
            <div
              className="profile-pic-container"
              style={{ borderRight: "1px solid #61C554" }}
            ></div>
            <div className="profile-info-container p-3 w-100">
              <div>เลขประจำตัว:</div>
              <div>ชื่อ-สกุล:</div>
              <div>เบอรํโทรศัพท์:</div>
              <div>วันเกิด:</div>
            </div>
          </div>
          <div className="w-100 mt-1 d-flex" style={{ border: "1px solid" }}>
            <div className="table-head" style={{ borderRight: "1px solid" }}>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#FFD786" }}
              >
                ที่อยู่
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                ชื่อหมู่บ้าน
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                บ้านเลขที่
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                หมู่ที่
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                ถนน/ตรอก/ซอย
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                ตำบล/แขวง
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                อำเภอ/เขต
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                จังหวัด
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                รหัสไปรษณีย์
              </div>
            </div>
            <div className="d-flex flex-column w-100">
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#FFD786", color: "transparent" }}
              >
                ที่อยู่
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
              </div>
              <div
                className="ps-3 pt-1 pb-1 mt-1"
                style={{ backgroundColor: "#BBBBBB" }}
              >
                -
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

export default Profile;
