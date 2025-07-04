import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Form, Alert, Button, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import {
  updateDoc,
  setDoc,
  doc,
  getDocs,
  collection,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import logo from "../assets/logo.png";

function SubjectsManagement() {
  const [regClassLevel, setRegClassLevel] = useState("ประถมศึกษาปีที่ 1");
  const [subjects, setSubjects] = useState([]);
  const [regSubjectName, setRegSubjectName] = useState("");
  const [regSubjectID, setRegSubjectID] = useState("");

  const [studentClass, setStudentClass] = useState("ประถมศึกษาปีที่ 1");

  const [teacherName, setTeacherName] = useState("");

  const [editIndex, setEditIndex] = useState(null);
  const [editSubjectID, setEditSubjectID] = useState("");
  const [editSubjectName, setEditSubjectName] = useState("");

  const [error, setError] = useState("");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { logOut, user, firstName, lastName } = useUserAuth();
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(data);
      console.log("Subjects data updated:", data);
    });

    return () => unsubscribe(); // ยกเลิกเมื่อ component unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setDoc(doc(db, "subjects", regSubjectID), {
        name: regSubjectName,
        classLevel: regClassLevel,
      });

      console.log("✅ Saved to Firestore!");

      // ✅ เคลียร์ฟอร์ม
      setRegSubjectID("");
      setRegSubjectName("");
    } catch (err) {
      setError(err.message);
      console.log("❌ Error during registration:", err);
    }
  };

  const handleEdit = (index, subject) => {
    setEditIndex(index);
    setEditSubjectID(subject.id);
    setEditSubjectName(subject.name);
  };

  const handleSave = async (oldId) => {
    try {
      // ถ้า id เปลี่ยน
      if (editSubjectID !== oldId) {
        // 1. สร้าง doc ใหม่ด้วย id ใหม่
        await setDoc(doc(db, "subjects", editSubjectID), {
          name: editSubjectName,
          classLevel: subjects.find((s) => s.id === oldId)?.classLevel || "",
          teacher: subjects.find((s) => s.id === oldId)?.teacher || "",
        });
        // 2. ลบ doc เดิม
        await deleteDoc(doc(db, "subjects", oldId));
      } else {
        // ถ้า id ไม่เปลี่ยน อัปเดตชื่อปกติ
        await updateDoc(doc(db, "subjects", oldId), {
          name: editSubjectName,
        });
      }
      setEditIndex(null);
    } catch (err) {
      console.error("❌ Error updating subject:", err);
    }
  };

  const handleDelete = async (teacherID, subjectID) => {
    try {
      await deleteDoc(doc(db, "subjects", subjectID));
      await setDoc(
        doc(db, "profile", teacherID),
        {
          user: {
            taughtSubject: deleteField(),
          },
        },
        { merge: true }
      );
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
    }
  };

  function getTeacherName(teacherId) {
    const teacherProfile = profileData.find((profileData) => {
      return profileData.id === teacherId;
    });
    return (
      (teacherProfile?.user?.firstName || "-") +
      " " +
      (teacherProfile?.user?.lastName || "-")
    );
  }

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

      <div className="shool-record-management-detail p-4">
        <Card className="shadow-lg rounded-4 w-100 h-100">
          <Card.Body>
            <h3 className="d-flex justify-content-center w-100 my-2 fw-bold">
              จัดการรายวิชา
            </h3>
            <h3 className="mb-4 fw-bold">ตัวเลือก</h3>
            <Row className="mb-4">
              <Col md={2}>
                <div className="select-wrapper">
                  <Form.Select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="modern-select text-center"
                  >
                    <option value="" disabled>
                      -- เลือกชั้นเรียน --
                    </option>
                    {[
                      "ประถมศึกษาปีที่ 1",
                      "ประถมศึกษาปีที่ 2",
                      "ประถมศึกษาปีที่ 3",
                      "ประถมศึกษาปีที่ 4",
                      "ประถมศึกษาปีที่ 5",
                      "ประถมศึกษาปีที่ 6",
                    ].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={7}>
                <div
                  className="table-wrapper border rounded bg-white shadow-sm"
                  style={{ height: "530px", overflow: "hidden" }}
                >
                  <table className="table table-bordered table-hover text-center m-0">
                    <thead
                      className="table-warning"
                      style={{ position: "sticky", top: 0, zIndex: 2 }}
                    >
                      <tr>
                        <th style={{ width: "25%" }}>รหัสวิชา</th>
                        <th style={{ width: "25%" }}>รายวิชา</th>
                        <th style={{ width: "25%" }}>ครูผู้สอน</th>
                        <th style={{ width: "25%" }}>ตัวเลือก</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="table-body-scroll no-scrollbar-container">
                    <div className="scroll-inner">
                      <table className="table table-bordered text-center m-0 table-hover">
                        <tbody>
                          {subjects
                            .filter(
                              (subject) => subject.classLevel === studentClass
                            )
                            .map((subject, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                    {index === editIndex ? (
                                      <Form.Control
                                        type="text"
                                        value={editSubjectID}
                                        onChange={(e) =>
                                          setEditSubjectID(e.target.value)
                                        }
                                        className="text-center"
                                      />
                                    ) : (
                                      subject.id
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                    {index === editIndex ? (
                                      <Form.Control
                                        type="text"
                                        value={editSubjectName}
                                        onChange={(e) =>
                                          setEditSubjectName(e.target.value)
                                        }
                                        className="text-center"
                                      />
                                    ) : (
                                      subject.name
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                    {getTeacherName(subject.teacher)}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2">
                                    {index === editIndex ? (
                                      <>
                                        <Button
                                          className="edit-butt mt-2"
                                          size="sm"
                                          onClick={() => handleSave(subject.id)}
                                        >
                                          บันทึก
                                        </Button>
                                        <Button
                                          className="delete-butt mt-2"
                                          size="sm"
                                          variant="secondary"
                                          onClick={() => setEditIndex(null)}
                                        >
                                          ยกเลิก
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          className="edit-butt"
                                          size="sm"
                                          onClick={() =>
                                            handleEdit(index, subject)
                                          }
                                        >
                                          แก้ไข
                                        </Button>
                                        <Button
                                          className="delete-butt"
                                          size="sm"
                                          variant="danger"
                                          onClick={() =>
                                            handleDelete(subject.teacher, subject.id)
                                          }
                                        >
                                          ลบ
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={5}>
                <Card className="p-4 shadow-sm">
                  <Card.Title className="fw-bold mb-3">เพิ่มรายวิชา</Card.Title>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col>
                        <div className="select-wrapper">
                          <Form.Select
                            value={regClassLevel}
                            onChange={(e) => setRegClassLevel(e.target.value)}
                            className="modern-select text-center"
                          >
                            <option value="" disabled>
                              -- เลือกชั้นเรียน --
                            </option>
                            {[
                              "ประถมศึกษาปีที่ 1",
                              "ประถมศึกษาปีที่ 2",
                              "ประถมศึกษาปีที่ 3",
                              "ประถมศึกษาปีที่ 4",
                              "ประถมศึกษาปีที่ 5",
                              "ประถมศึกษาปีที่ 6",
                            ].map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="รหัสวิชา"
                          className="modern-input"
                          value={regSubjectID}
                          onChange={(e) => setRegSubjectID(e.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="ชื่อวิชา"
                          className="modern-input"
                          value={regSubjectName}
                          onChange={(e) => setRegSubjectName(e.target.value)}
                        />
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100 rounded-pill mt-2"
                    >
                      เพิ่มรายวิชา
                    </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default SubjectsManagement;
