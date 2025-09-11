import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Form, Button, Modal, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  updateDoc,
  setDoc,
  getDoc,
  doc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import Navbar from "./Navbar";
import Footer from "./Footer";

function UserManagement() {
  const [adminID, setAdminID] = useState("");
  const [managerID, setManagerID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPosition, setRegPosition] = useState("ครู");
  const [regClassLevel, setRegClassLevel] = useState("ประถมศึกษาปีที่ 1");
  const [regtaughtSubject, setRegTaughtSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [position, setPosition] = useState("ครู");
  const [studentClass, setStudentClass] = useState("ประถมศึกษาปีที่ 1");
  const { signUp, logOut } = useUserAuth();
  const { profileData, userDelete } = useUserProfile();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับสร้างรหัสนักเรียน
  async function counter1() {
    //generate รหัสนักเรียน
    let newStudentID = null;
    try {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        newStudentID = counterdoc.data().lastStudentID + 1;
        await updateDoc(doc(db, "id_counter", "kUHECVelJyWh1piBZsTH"), {
          lastStudentID: newStudentID,
        });
        setStudentID(newStudentID);
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
    return newStudentID;
  }

  // ฟังก์ชันสำหรับสร้างรหัสครู
  async function counter2() {
    //generate รหัสครู
    let newTeacherID = null;
    try {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        newTeacherID = counterdoc.data().lastTeacherID + 1;
        await updateDoc(doc(db, "id_counter", "kUHECVelJyWh1piBZsTH"), {
          lastTeacherID: newTeacherID,
        });
        setTeacherID(newTeacherID);
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
    return newTeacherID;
  }

  // ฟังก์ชันสำหรับสร้างรหัสแอดมิน
  async function counter3() {
    //generate รหัสแอดมิน
    let newAdminID = null;
    try {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        newAdminID = counterdoc.data().lastAdminID + 1;
        await updateDoc(doc(db, "id_counter", "kUHECVelJyWh1piBZsTH"), {
          lastAdminID: newAdminID,
        });
        setAdminID(newAdminID);
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
    return newAdminID;
  }

  // ฟังก์ชันสำหรับสร้างรหัสผู้อำนวยการ
  async function counter4() {
    //generate รหัสผู้จัดการ
    let newManagerID = null;
    try {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        newManagerID = counterdoc.data().lastManagerID + 1;
        await updateDoc(doc(db, "id_counter", "kUHECVelJyWh1piBZsTH"), {
          lastManagerID: newManagerID,
        });
        setManagerID(newManagerID);
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาด:", error);
    }
    return newManagerID;
  }

  // ฟังชันสำหรับดึงรหัสนักเรียนและรหัสครูล่าสุดจาก Firestore
  useEffect(() => {
    const fetchCounter = async () => {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        const data = counterdoc.data();
        if (
          typeof data.lastStudentID === "number" &&
          typeof data.lastTeacherID === "number" &&
          typeof data.lastAdminID === "number" &&
          typeof data.lastManagerID === "number"
        ) {
          setStudentID(data.lastStudentID + 1);
          setTeacherID(data.lastTeacherID + 1);
          setAdminID(data.lastAdminID + 1);
          setManagerID(data.lastManagerID + 1);
        } else {
          console.log(
            "Missing lastStudentID or lastTeacherID in counter document"
          );
        }
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    };
    fetchCounter();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูลผู้ใช้ตามตำแหน่งและชั้นเรียน
  const filteredData = (profileData || []).filter((item) => {
    if (position === "ครู") {
      return item.user?.position === "ครู";
    } else if (position === "นักเรียน") {
      return (
        item.user?.position === "นักเรียน" &&
        item.user?.classLevel === studentClass
      );
    } else if (position === "แอดมิน") {
      return item.user?.position === "แอดมิน";
    } else if (position === "ผู้อำนวยการ") {
      return item.user?.position === "ผู้อำนวยการ";
    }
  });

  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  // ฟังก์ชันสำหรับแก้ไขข้อมูลผู้ใช้
  const handelEdit = async (id) => {
    try {
      navigate(`/usermanagement/profile?id=${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูลผู้ใช้
  const handelDelete = async (id) => {
    try {
      await userDelete(id);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ฟังก์ชันสำหรับสมัครสมาชิกผู้ใช้ใหม่
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let lastStudentID = null;
    let lastTeacherID = null;
    let lastAdminID = null;
    let lastManagerID = null;
    let user = null;

    try {
      if (regPosition === "นักเรียน") {
        lastStudentID = await counter1();
        user = await signUp(
          `${lastStudentID}@gmail.com`,
          `banhae${lastStudentID}`
        );
      }

      if (regPosition === "ครู") {
        lastTeacherID = await counter2();
        user = await signUp(
          `${lastTeacherID}@gmail.com`,
          `banhae${lastTeacherID}`
        );
      }

      if (regPosition === "แอดมิน") {
        lastAdminID = await counter3();
        user = await signUp(
          `${lastAdminID}@gmail.com`,
          `banhae${lastAdminID}`
        );
      }

      if (regPosition === "ผู้อำนวยการ") {
        lastManagerID = await counter4();
        user = await signUp(
          `${lastManagerID}@gmail.com`,
          `banhae${lastManagerID}`
        );
      }

      if (!user) {
        setError("ไม่สามารถสมัครผู้ใช้ได้ (user is null)");
        return;
      }
      handleClose();

      const userProfile = {
        createdAt: new Date(),
        user: {
          firstName: regFirstName,
          lastName: regLastName,
          position: regPosition,
        },
      };

      if (regPosition === "นักเรียน") {
        userProfile.user.studentID = lastStudentID;
        userProfile.user.classLevel = regClassLevel;
      } else if (regPosition === "ครู") {
        userProfile.user.teacherID = lastTeacherID;
      } else if (regPosition === "แอดมิน") {
        userProfile.user.adminID = lastAdminID;
      } else if (regPosition === "ผู้อำนวยการ") {
        userProfile.user.managerID = lastManagerID;
      }

      await setDoc(doc(db, "profile", user.uid), userProfile);

      if (
        regPosition === "ครู" &&
        regtaughtSubject &&
        regtaughtSubject.trim() !== ""
      ) {
        if (regPosition === "ครู" && regtaughtSubject) {
          await setDoc(
            doc(db, "subjects", regtaughtSubject),
            {},
            { merge: true }
          );
          await updateDoc(doc(db, "subjects", regtaughtSubject), {
            teachers: arrayUnion(user.uid),
          });
        }
      }

      console.log("✅ User registered and data saved to Firestore!");

      setRegFirstName("");
      setRegLastName("");
      setRegPosition("ครู");
      setRegClassLevel("ประถมศึกษาปีที่ 1");
      setRegTaughtSubject("");
    } catch (err) {
      setError(err.message);
      console.log("❌ Error during registration:", err);
    }
  };

  // ฟังชันสำหรับอัพเดตข้อมูลแบบเรียลไทม์
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const newData = [];
      snapshot.forEach((doc) => {
        newData.push({ id: doc.id, ...doc.data() });
      });
      if (newData.length === 0) return;

      setSubjects(newData);
    });

    return () => unsubscribe();
  }, []);

  const labelPosition = {
    ครู: "ครู",
    นักเรียน: "นักเรียน",
    แอดมิน: "แอดมิน",
    ผู้อำนวยการ: "ผู้อำนวยการ",
  };

  return (
    <div className="shool-record-management-page">
      <Navbar />

      <div className="shool-record-management-detail page-detail p-4">
        <Card
          className="shadow-lg rounded-4 w-100"
          style={{ minHeight: "80vh", height: "auto" }}
        >
          <Card.Body>
            <h3 className="d-flex justify-content-center w-100 my-2 fw-bold">
              จัดการข้อมูลผู้ใช้
            </h3>
            <h3 className="mb-4 fw-bold">ตัวเลือก</h3>

            <Row className="mb-4">
              <Col md={2}>
                <div className="select-wrapper">
                  <Form.Select
                    value={position}
                    className="modern-select text-center"
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    {Object.entries(labelPosition).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>

              {position === "นักเรียน" && (
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
              )}

              <Col className="d-flex justify-content-end">
                <Button
                  className="rounded-pill mt-2 edit-butt"
                  onClick={handleShow}
                >
                  เพิ่มข้อมูลผู้ใช้
                </Button>
              </Col>
            </Row>

            <Row className="g-4 mb-4">
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
                      {position === "ครู" ? (
                        <tr>
                          <th style={{ width: "20%" }}>รหัสประจำตัว</th>
                          <th style={{ width: "20%" }}>ชื่อ-สกุล</th>
                          <th style={{ width: "20%" }}>วิชาที่สอน</th>
                          <th style={{ width: "20%" }}>ชั้นเรียนที่สอน</th>
                          <th style={{ width: "20%" }}>ตัวเลือก</th>
                        </tr>
                      ) : (
                        <tr>
                          <th style={{ width: "33.3%" }}>รหัสประจำตัว</th>
                          <th style={{ width: "33.3%" }}>ชื่อ-สกุล</th>
                          <th style={{ width: "33.3%" }}>ตัวเลือก</th>
                        </tr>
                      )}
                    </thead>
                  </table>
                  <div className="table-body-scroll no-scrollbar-container">
                    <div className="scroll-inner">
                      <table className="table table-bordered text-center m-0 table-hover">
                        {position === "ครู" ? (
                          <tbody>
                            {[...filteredData]
                              .sort((a, b) =>
                                (a.user?.teacherID || a.user?.studentID || "")
                                  .toString()
                                  .localeCompare(
                                    (
                                      b.user?.teacherID ||
                                      b.user?.studentID ||
                                      ""
                                    ).toString()
                                  )
                              )
                              .map((item, index) => (
                                <tr key={index}>
                                  <td
                                    style={{ width: "20%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {/* แสดงรหัสประจำตัว (teacherID หรือ studentID) */}
                                      {item.user?.teacherID ||
                                        item.user?.studentID ||
                                        "-"}
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "20%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {item.user?.firstName}{" "}
                                      {item.user?.lastName}
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "20%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex flex-column justify-content-center align-items-start w-100 h-100 py-2">
                                      {Array.isArray(item.user?.taughtSubject)
                                        ? item.user.taughtSubject.map(
                                            (subjectId) => {
                                              const subject = subjects.find(
                                                (s) => s.id === subjectId
                                              );
                                              return (
                                                <div
                                                  key={subjectId}
                                                  className="border-bottom border-top border-black w-100 mt-1"
                                                >
                                                  {subject
                                                    ? `${subject.id} ${subject.name}`
                                                    : "ไม่พบวิชา"}
                                                </div>
                                              );
                                            }
                                          )
                                        : item.user?.taughtSubject
                                        ? `${item.user.taughtSubject.id} ${item.user.taughtSubject.name}`
                                        : "-"}
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "20%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100 py-2">
                                      {Array.isArray(item.user?.taughtSubject)
                                        ? item.user.taughtSubject.map(
                                            (subjectId) => {
                                              const subject = subjects.find(
                                                (s) => s.id === subjectId
                                              );
                                              return (
                                                <div
                                                  key={subjectId}
                                                  className="border-bottom border-top border-black w-100 mt-1"
                                                >
                                                  {subject
                                                    ? subject.classLevel
                                                    : "ไม่พบชั้นเรียน"}
                                                </div>
                                              );
                                            }
                                          )
                                        : subjects.find(
                                            (s) =>
                                              s.id === item.user?.taughtSubject
                                          )?.classLevel || "-"}
                                    </div>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <div className="d-flex justify-content-center gap-2 align-items-center w-100 h-100">
                                      <Button
                                        className="edit-butt"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handelEdit(item.id);
                                        }}
                                      >
                                        แก้ไข
                                      </Button>
                                      <Button
                                        className="delete-butt"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handelDelete(item.id);
                                        }}
                                      >
                                        ลบ
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        ) : (
                          <tbody>
                            {[...filteredData]
                              .sort((a, b) =>
                                (a.user?.teacherID || a.user?.studentID || "")
                                  .toString()
                                  .localeCompare(
                                    (
                                      b.user?.teacherID ||
                                      b.user?.studentID ||
                                      b.user?.adminID ||
                                      b.user?.managerID ||
                                      ""
                                    ).toString()
                                  )
                              )
                              .map((item, index) => (
                                <tr key={index}>
                                  <td
                                    style={{ width: "33.3%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {item.user?.teacherID ||
                                        item.user?.studentID ||
                                        item.user?.adminID ||
                                        item.user?.managerID ||
                                        "-"}
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "33.3%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {item.user?.firstName}{" "}
                                      {item.user?.lastName}
                                    </div>
                                  </td>
                                  <td style={{ width: "33.3%" }}>
                                    <div className="d-flex justify-content-center gap-2">
                                      <Button
                                        className="edit-butt"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handelEdit(item.id);
                                        }}
                                      >
                                        แก้ไข
                                      </Button>
                                      <Button
                                        className="delete-butt"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handelDelete(item.id);
                                        }}
                                      >
                                        ลบ
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">เพิ่มข้อมูลผู้ใช้</Modal.Title>
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
                                value={regPosition}
                                onChange={(e) => setRegPosition(e.target.value)}
                                className="modern-select text-center"
                              >
                                {Object.entries(labelPosition).map(
                                  ([value, label]) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </div>
                          </Col>
                          <Col>
                            {regPosition === "ครู" ? (
                              <div className="select-wrapper">
                                <Form.Select
                                  value={regtaughtSubject}
                                  onChange={(e) =>
                                    setRegTaughtSubject(e.target.value)
                                  }
                                  className="modern-select text-center"
                                >
                                  <option value="" disabled>
                                    -- เลือกวิชาที่สอน --
                                  </option>
                                  {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                      {subject.id} {subject.name}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            ) : regPosition === "นักเรียน" ? (
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
                            ) : regPosition === "แอดมิน" ? (
                              <div>
                                <Form.Control
                                  type="text"
                                  value={"รหัสประจำตัว : " + adminID}
                                  className="modern-input fw-bold"
                                  disabled
                                />
                              </div>
                            ) : regPosition === "ผู้อำนวยการ" ? (
                              <div>
                                <Form.Control
                                  type="text"
                                  value={"รหัสประจำตัว : " + managerID}
                                  className="modern-input fw-bold"
                                  disabled
                                />
                              </div>
                            ) : null}
                          </Col>
                        </Row>

                        {regPosition === "นักเรียน" ? (
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Control
                                type="text"
                                value={"รหัสประจำตัว : " + studentID}
                                className="modern-input fw-bold"
                                disabled
                              />
                            </Col>
                          </Row>
                        ) : regPosition === "ครู" ? (
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Control
                                type="text"
                                value={"รหัสประจำตัว : " + teacherID}
                                className="modern-input fw-bold"
                                disabled
                              />
                            </Col>
                          </Row>
                        ) : null}

                        <Row className="mb-3">
                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="ชื่อ"
                              value={regFirstName}
                              onChange={(e) => setRegFirstName(e.target.value)}
                              className="modern-input"
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="สกุล"
                              value={regLastName}
                              onChange={(e) => setRegLastName(e.target.value)}
                              className="modern-input"
                            />
                          </Col>
                        </Row>
                        
                        <Modal.Footer className="d-flex justify-content-center">
                          <Button
                            className="rounded-pill mt-2 edit-butt"
                            type="submit"
                          >
                            เพิ่มข้อมูลผู้ใช้
                          </Button>
                        </Modal.Footer>
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

export default UserManagement;
