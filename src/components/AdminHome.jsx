import React from "react";
import { Link } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AdminHome() {
  return (
    <div className="screen">
      {/* Navigation */}
      <Navbar />

      {/* Dashboard */}
      <div className="dashboard-container page-detail">
        <div className="dashboard-header">
          <h2 className="custom-h1 fw-bold">แดชบอร์ด</h2>
          <hr />
          <p className="custom-h5">เลือกเมนูเพื่อไปยังหน้าต่าง ๆ ของระบบ</p>
        </div>
        <div className="dashboard-grid">
          {[
            {
              path: "/usermanagement",
              icon: "/group.png",
              label: "จัดการข้อมูลผู้ใช้",
            },
            {
              path: "/subjects-management",
              icon: "/text-books.png",
              label: "จัดการรายวิชา",
            },
            {
              path: "/time-table-management",
              icon: "/clock.png",
              label: "จัดการตารางเวลา",
            },
            {
              path: "/student-table-management",
              icon: "/weekly.png",
              label: "จัดการตารางเรียน",
            },
            {
              path: "/teacher-table-management",
              icon: "/training.png",
              label: "จัดการตารางสอน",
            },
            {
              path: "/school-record-management",
              icon: "/education.png",
              label: "จัดการผลการเรียน",
            },
          ].map(({ path, icon, label }, i) => (
            <Link to={path} key={i} className="dashboard-card custom-h3">
              <img src={icon} alt={label} className="dashboard-icon" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}

export default AdminHome;
