import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Form, Alert, Button, Modal, Row, Col, Card } from "react-bootstrap";
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
import Navbar from "./Navbar";
import Footer from "./Footer";

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [error, setError] = useState("");

  const { profileData } = useUserProfile();

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

      // ปิด modal
      handleClose();
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
    <div className="page" style={{ backgroundColor: "#BBBBBB" }}>
      <Navbar />

      <div className="shool-record-management-detail page-detail p-4">
        <Card className="shadow-lg rounded-4 w-100" style={{ minHeight: "80vh", height: "auto" }}>
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
              <Col className="d-flex justify-content-end">
                <Button
                  className="rounded-pill mt-2 edit-butt"
                  onClick={handleShow}
                >
                  เพิ่มรายวิชา
                </Button>
              </Col>
            </Row>

            <Row className="g-4">
              <Col md={12}>
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
                                    {Array.isArray(subject.teachers) &&
                                    subject.teachers.length > 0
                                      ? subject.teachers
                                          .map((teacherId) =>
                                            getTeacherName(teacherId)
                                          )
                                          .join(", ")
                                      : "-"}
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
                                            handleDelete(
                                              subject.teacher,
                                              subject.id
                                            )
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
            </Row>

            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">เพิ่มรายวิชา</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Card className="p-4 shadow-sm">
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                          <Col>
                            <div className="select-wrapper">
                              <Form.Select
                                value={regClassLevel}
                                onChange={(e) =>
                                  setRegClassLevel(e.target.value)
                                }
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
                              onChange={(e) =>
                                setRegSubjectName(e.target.value)
                              }
                            />
                          </Col>
                        </Row>

                        <Button
                          type="submit"
                          variant="primary"
                          className="w-100 rounded-pill mt-2 edit-butt"
                        >
                          เพิ่มรายวิชา
                        </Button>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

export default SubjectsManagement;
