import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import logo from "../assets/logo.png";

function DropdownMenu({ label, links, open, setOpen, menuRef }) {
  return (
    <div className="dropdown" ref={menuRef}>
      <div className="dropdown-trigger" onClick={() => setOpen(!open)}>
        <div className="custom-h5">{label}</div>
        <svg
          className={`dropdown-icon ${open ? "rotate" : ""}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </div>
      <div className={`dropdown-content ${open ? "active" : "inactive"}`}>
        {links.map(({ label, path }, index) => (
          <Link to={path} key={index}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  const [dropdowns, setDropdowns] = useState({
    open1: false,
    open2: false,
    open3: false,
  });
  const menuRefs = { menu1: useRef(), menu2: useRef(), menu3: useRef() };
  const { logOut, user, firstName, lastName } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRefs.menu1.current &&
        !menuRefs.menu1.current.contains(e.target)
      ) {
        setDropdowns((prev) => ({ ...prev, open1: false }));
      }
      if (
        menuRefs.menu2.current &&
        !menuRefs.menu2.current.contains(e.target)
      ) {
        setDropdowns((prev) => ({ ...prev, open2: false }));
      }
      if (
        menuRefs.menu3.current &&
        !menuRefs.menu3.current.contains(e.target)
      ) {
        setDropdowns((prev) => ({ ...prev, open3: false }));
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="nav">
      <div className="logo-container">
        <div className="logo-img" onClick={() => navigate("/")}>
          <svg width="47" height="46" viewBox="0 0 47 46" fill="none">
            <ellipse cx="23.5" cy="23" rx="23.5" ry="23" fill="white" />
          </svg>
          <img src={logo} alt="logo" className="w-100 h-100" />
        </div>
        <div className="custom-h2">โรงเรียนบ้านแฮะ</div>
      </div>

      {/* Menu */}
      <div className="menu-container">
        <DropdownMenu
          label="ทะเบียน"
          links={[
            { label: "ข้อมูลส่วนตัว", path: `/profile?id=${user.uid}` },
            { label: "จัดการข้อมูลผู้ใช้", path: "/usermanagement" },
            { label: "จัดการรายวิชา", path: "/subjects-management" },
            { label: "จัดการตารางเวลา", path: "/time-table-management" },
            { label: "จัดการตารางเรียน", path: "/student-table-management" },
            { label: "จัดการตารางสอน", path: "/teacher-table-management" },
          ]}
          open={dropdowns.open2}
          setOpen={(open) => setDropdowns({ ...dropdowns, open2: open })}
          menuRef={menuRefs.menu2}
        />
        <DropdownMenu
          label="ประมวลผลการเรียน"
          links={[
            { label: "จัดการผลการเรียน", path: "/school-record-management" },
          ]}
          open={dropdowns.open3}
          setOpen={(open) => setDropdowns({ ...dropdowns, open3: open })}
          menuRef={menuRefs.menu3}
        />
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

      {/* Profile Dropdown */}
      <div className="dropdown-container" ref={menuRefs.menu1}>
        <div
          className="dropdown-trigger"
          onClick={() =>
            setDropdowns({ ...dropdowns, open1: !dropdowns.open1 })
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 22C4 19.8783 4.84285 17.8434 6.34315 16.3431C7.84344 14.8429 9.87827 14 12 14C14.1217 14 16.1566 14.8429 17.6569 16.3431C19.1571 17.8434 20 19.8783 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"
              fill="black"
            />
          </svg>
          <div className="custom-h5">{firstName}</div>
        </div>
        <div
          className={`dropdown-menu-2 ${
            dropdowns.open1 ? "active" : "inactive"
          }`}
        >
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
  );
}

export default Navbar;
