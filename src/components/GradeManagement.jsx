import React, { useState, useEffect } from "react";
import { Form, Alert, Button, Row, Col, Card } from "react-bootstrap";
import { useUserProfile } from "../context/ProfileDataContex";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { db } from "../firebase";
import logo from "../assets/logo.png";

function GradeManagement() {
  const [students, setStudents] = useState([]);
  const [studentClass, setStudentClass] = useState("ประถมศึกษาปีที่ 1");

  const { profileData } = useUserProfile();

  useEffect(() => {
    if (!profileData || profileData.length === 0) return;

    const loadStudents = profileData.filter(
      (profile) => profile.user && profile.user.position === "นักเรียน"
    );

    setStudents(loadStudents);
    console.log("นักเรียนทั้งหมด:", loadStudents);
  }, [profileData]);

  const filteredData = students.filter(
    (item) => item.user && item.user.classLevel === studentClass
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
      <Navbar />
      <div className="p-3 page-detail">
        <div className="bg-white page-detail-box">
          <div className="d-flex justify-content-center custom-h1 fw-bold p-3">
            จัดการคะแนนรายวิชา
          </div>
          <div className="custom-h2 d-flex align-items-center gap-4 p-3 w-100">
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
          <div className="w-100 p-3">
            <table className="w-100">
              <thead>
                <tr className="grade-header">
                  <th
                    rowSpan={4}
                    className="text-center"
                    style={{ minWidth: "100px" }}
                  >
                    รหัสประจำตัว
                  </th>
                  <th
                    rowSpan={4}
                    className="text-center"
                    style={{ minWidth: "200px" }}
                  >
                    ชื่อ - นามสกุล
                  </th>
                  <th colSpan={4} className="text-center">
                    ภาคเรียนที่ 1
                  </th>
                  <th colSpan={4} className="text-center">
                    ภาคเรียนที่ 2
                  </th>
                  <th colSpan={2} className="text-center">
                    ผลการเรียนรู้รายปี
                  </th>
                  <th rowSpan={4} className="text-center">
                    ผลการแก้ไข
                  </th>
                  <th rowSpan={2} colSpan={2} className="text-center">
                    สรุปผลการประเมิน
                  </th>
                  <th rowSpan={4} className="text-center">
                    หมายเหตุ
                  </th>
                </tr>
                <tr className="grade-header">
                  <th rowSpan={2} className="text-center">
                    ตัวชี้วัด
                  </th>
                  <th className="text-center">ระหว่างเรียน</th>
                  <th className="text-center">ปลายภาค</th>
                  <th className="text-center">รวม</th>
                  <th rowSpan={2} className="text-center">
                    ตัวชี้วัด
                  </th>
                  <th className="text-center">ระหว่างเรียน</th>
                  <th className="text-center">ปลายภาค</th>
                  <th className="text-center">รวม</th>
                  <th className="text-center">รวม 2 ภาค</th>
                  <th rowSpan={3} className="text-center">
                    ระดับผลการเรียน
                  </th>
                </tr>
                <tr className="grade-header">
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th className="text-center">เต็ม</th>
                  <th rowSpan={2} className="text-center">
                    ผ่าน
                  </th>
                  <th rowSpan={2} className="text-center">
                    ไม่ผ่าน
                  </th>
                </tr>
                <tr className="grade-header">
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                  <th className="text-center" style={{ maxWidth: "30px" }}>
                    <Form.Control></Form.Control>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student) => (
                  <tr key={student.id} className="grade-header">
                    <td className="text-center">{student.user.studentID}</td>
                    <td className="text-center">
                      {student.user.firstName} {student.user.lastName}
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                    <td className="text-center">
                      <Form.Control type="text" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GradeManagement;
