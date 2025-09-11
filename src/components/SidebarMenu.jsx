import React, { useState } from "react";
import { Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import "./SidebarMenu.css";

export default function SidebarMenu({ firstName, lastName, handleLogout }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const { user, userRole } = useUserAuth();

  return (
    <div className="sidebar custom-h5">
      <div className="sidebar-menu-item">
        <button
          type="button"
          onClick={() => toggleMenu("reg")}
          aria-expanded={openMenu === "reg"}
          aria-controls="dd-reg"
        >
          <span>ทะเบียน</span>
          <span
            className={`chev ${openMenu === "reg" ? "open" : ""}`}
            aria-hidden
          />
        </button>
        <div
          id="dd-reg"
          className={`sidebar-dropdown ${openMenu === "reg" ? "show" : ""}`}
          role="region"
          aria-label="เมนูย่อย ทะเบียน"
        >
          {(userRole === "admin"
            ? [
                { label: "ข้อมูลส่วนตัว", path: `/profile?id=${user.uid}` },
                { label: "จัดการข้อมูลผู้ใช้", path: "/usermanagement" },
                { label: "จัดการรายวิชา", path: "/subjects-management" },
                { label: "จัดการตารางเวลา", path: "/time-table-management" },
                {
                  label: "จัดการตารางเรียน",
                  path: "/student-table-management",
                },
                { label: "จัดการตารางสอน", path: "/teacher-table-management" },
              ]
            : userRole === "ครู"
            ? [
                { label: "ข้อมูลส่วนตัว", path: `/profile?id=${user.uid}` },
                { label: "ตารางสอน", path: `/teacher-table` },
              ]
            : userRole === "นักเรียน"
            ? [
                { label: "ข้อมูลส่วนตัว", path: `/profile?id=${user.uid}` },
                { label: "ตารางเรียน", path: `/student-table` },
              ]
            : [{ label: "ข้อมูลส่วนตัว", path: `/profile?id=${user.uid}` }]
          ).map((item, idx) => (
            <Link key={idx} to={item.path}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {userRole != "ผู้อำนวยการ" && (
        <div className="sidebar-menu-item">
          <button
            type="button"
            onClick={() => toggleMenu("grade")}
            aria-expanded={openMenu === "grade"}
            aria-controls="dd-grade"
          >
            <span>ประมวลผลการเรียน</span>
            <span
              className={`chev ${openMenu === "grade" ? "open" : ""}`}
              aria-hidden
            />
          </button>
          <div
            id="dd-grade"
            className={`sidebar-dropdown ${openMenu === "grade" ? "show" : ""}`}
            role="region"
            aria-label="เมนูย่อย ประมวลผลการเรียน"
          >
            {(userRole === "admin"
              ? [
                  {
                    label: "จัดการผลการเรียน",
                    path: "/school-record-management",
                  },
                ]
              : userRole === "ครู"
              ? [{ label: "จัดการคะแนนรายวิชา", path: `/grade-management` }]
              : [{ label: "ผลคะแนนรายวิชา", path: `/student-records` }]
            ).map((item, idx) => (
              <Link key={idx} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-menu-item">
        <button
          type="button"
          onClick={() => toggleMenu("request")}
          aria-expanded={openMenu === "request"}
          aria-controls="dd-request"
        >
          <span>คำร้อง</span>
          <span
            className={`chev ${openMenu === "request" ? "open" : ""}`}
            aria-hidden
          />
        </button>
        <div
          id="dd-request"
          className={`sidebar-dropdown ${openMenu === "request" ? "show" : ""}`}
          role="region"
          aria-label="เมนูย่อย คำร้อง"
        >
          <div>ยังไม่เปิดการใช้งาน</div>
        </div>
      </div>
    </div>
  );
}
