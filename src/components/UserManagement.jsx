import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Form, Alert, Button, Row, Col, Card } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  updateDoc,
  setDoc,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import logo from "../assets/logo.png";

function UserManagement() {
  const [studentID, setStudentID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regPosition, setRegPosition] = useState("ครู");
  const [regClassLevel, setRegClassLevel] = useState("ประถมศึกษาปีที่ 1");
  const [regtaughtSubject, setRegTaughtSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [position, setPosition] = useState("ครู");
  const [studentClass, setStudentClass] = useState("ประถมศึกษาปีที่ 1");
  const { signUp, logOut, user, firstName, lastName } = useUserAuth();
  const { profileData, userEdit, userDelete } = useUserProfile();

  const [error, setError] = useState("");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
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

  const filteredData = profileData.filter((item) => {
    if (position === "ครู") {
      return item.user?.position === "ครู";
    } else if (position === "นักเรียน") {
      return (
        item.user?.position === "นักเรียน" &&
        item.user?.classLevel === studentClass
      );
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handelEdit = async (id) => {
    try {
      navigate(`/usermanagement/profile?id=${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handelDelete = async (id) => {
    try {
      await userDelete(id);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let lastStudentID = null;
    let lastTeacherID = null;
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

      if (!user) {
        setError("ไม่สามารถสมัครผู้ใช้ได้ (user is null)");
        return;
      }

      const userProfile = {
        createdAt: new Date(),
        user: {
          studentID: regPosition === "นักเรียน" ? lastStudentID : null,
          teacherID: regPosition === "ครู" ? lastTeacherID : null,
          classLevel: regPosition === "นักเรียน" ? regClassLevel : null,
          taughtSubject: regPosition === "ครู" ? regtaughtSubject : null,
          firstName: regFirstName,
          lastName: regLastName,
          position: regPosition,
        },
      };

      await setDoc(doc(db, "profile", user.uid), userProfile);
      await setDoc(
        doc(db, "subjects", regtaughtSubject),
        { teacher: user.uid },
        { merge: true }
      );

      console.log("✅ User registered and data saved to Firestore!");

      // ✅ เคลียร์ฟอร์ม
      setRegFirstName("");
      setRegLastName("");
      setEmail("");
      setPassword("");
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
      console.log("Subjects updated:", newData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounter = async () => {
      const counterdoc = await getDoc(
        doc(db, "id_counter", "kUHECVelJyWh1piBZsTH")
      );
      if (counterdoc.exists()) {
        setStudentID(counterdoc.data().lastStudentID + 1);
        setTeacherID(counterdoc.data().lastTeacherID + 1);
      } else {
        console.log("ไม่พบเอกสาร counter");
      }
    };
    fetchCounter();
  }, []);

  return (
    <div className="shool-record-management-page">
      <div className="nav">
        <div className="logo-container" onClick={() => navigate("/")}>
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
              จัดการข้อมูลผู้ใช้
            </h3>
            <h3 className="mb-4 fw-bold">ตัวเลือก</h3>

            <Row className="mb-4">
              <Col md={2}>
                <div className="select-wrapper">
                  <Form.Select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="modern-select text-center"
                  >
                    <option value="ครู">ครู</option>
                    <option value="นักเรียน">นักเรียน</option>
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
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {item.user?.taughtSubject || "-"}{" "}
                                      {subjects.find(
                                        (s) => s.id === item.user?.taughtSubject
                                      )?.name || "-"}
                                    </div>
                                  </td>
                                  <td
                                    style={{ width: "20%" }}
                                    onClick={() =>
                                      navigate(`/profile?id=${item.id}`)
                                    }
                                  >
                                    <div className="d-flex justify-content-center align-items-center w-100 h-100 py-2">
                                      {subjects.find(
                                        (s) => s.id === item.user?.taughtSubject
                                      )?.classLevel || "-"}
                                    </div>
                                  </td>
                                  <td style={{ width: "20%" }}>
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
                                      {/* แสดงรหัสประจำตัว (teacherID หรือ studentID) */}
                                      {item.user?.teacherID ||
                                        item.user?.studentID ||
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

            <Row>
              <Col md={5}>
                <Card className="p-4 shadow-sm">
                  <Card.Title className="fw-bold mb-3">
                    เพิ่มข้อมูลผู้ใช้
                  </Card.Title>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col>
                        <div className="select-wrapper">
                          <Form.Select
                            value={regPosition}
                            onChange={(e) => setRegPosition(e.target.value)}
                            className="modern-select text-center"
                          >
                            <option value="ครู">ครู</option>
                            <option value="นักเรียน">นักเรียน</option>
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
                        ) : (
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
                        )}
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
                    ) : (
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
                    )}

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

                    <Button
                      type="submit"
                      className="w-100 rounded-pill mt-2 edit-butt"
                    >
                      เพิ่มผู้ใช้งาน
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

export default UserManagement;
