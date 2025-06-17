import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { useStudentGrades } from "../context/StudentGradesContex";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import logo from "../assets/logo.png";

function GradeManagementStudent() {
  const [student, setStudent] = useState([]);
  const [studentID, setStudentID] = useState("");

  const [subjectIndicator1, setSubjectIndicator1] = useState(0);
  const [subjectIndicator2, setSubjectIndicator2] = useState(0);

  const [midtermScore1, setMidtermScore1] = useState(0);
  const [midtermFullScore1, setMidtermFullScore1] = useState(0);
  const [finalScore1, setFinalScore1] = useState(0);
  const [finalFullScore1, setFinalFullScore1] = useState(0);
  const [totalScoreSemester1, setTotalScoreSemester1] = useState(0);
  const [totalFullScoreSemester1, setTotalFullScoreSemester1] = useState(0);

  const [midtermScore2, setMidtermScore2] = useState(0);
  const [midtermFullScore2, setMidtermFullScore2] = useState(0);
  const [finalScore2, setFinalScore2] = useState(0);
  const [finalFullScore2, setFinalFullScore2] = useState(0);
  const [totalScoreSemester2, setTotalScoreSemester2] = useState(0);
  const [totalFullScoreSemester2, setTotalFullScoreSemester2] = useState(0);

  const [grade, setGrade] = useState(0);

  const [evaluationResult, setEvaluationResult] = useState("");

  const [totalScore, setTotalScore] = useState(0);

  const [activeButton, setActiveButton] = useState(1);

  const [error, setError] = useState("");

  const { logOut, user, firstName, lastName, userRole } = useUserAuth();
  const { studentGradesData } = useStudentGrades();
  const { profileData } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

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

  const buttons = [
    "สรุปการประเมิน",
    "เวลาเรียน",
    "คะแนนตัวชี้วัด1",
    "คะแนนตัวชี้วัด2",
    "คุณลักษณะพึงประสงค์",
    "อ่าน คิดวิเคราะห์ เขียน",
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) setStudentID(id);
  }, [location.search]);

  useEffect(() => {
    if (!profileData || profileData.length === 0) return;

    const loadStudent = profileData.find((profile) => profile.id === studentID);

    setStudent(loadStudent);
    console.log("นักเรียน:", loadStudent);
  }, [profileData, studentID]);

  useEffect(() => {
    if (!studentGradesData || studentGradesData.length === 0) return;

    const loadStudentGrades = studentGradesData.find(
      (item) => item.id === studentID
    );

    if (!loadStudentGrades) return;

    setSubjectIndicator1(loadStudentGrades.subjectIndicator1);
    setSubjectIndicator2(loadStudentGrades.subjectIndicator2);
    setMidtermScore1(loadStudentGrades.midtermScore1);
    setMidtermFullScore1(loadStudentGrades.midtermFullScore1);
    setFinalScore1(loadStudentGrades.finalScore1);
    setFinalFullScore1(loadStudentGrades.finalFullScore1);
    setTotalScoreSemester1(loadStudentGrades.totalScoreSemester1);
    setTotalFullScoreSemester1(loadStudentGrades.totalFullScoreSemester1);
    setMidtermScore2(loadStudentGrades.midtermScore2);
    setMidtermFullScore2(loadStudentGrades.midtermFullScore2);
    setFinalScore2(loadStudentGrades.finalScore2);
    setFinalFullScore2(loadStudentGrades.finalFullScore2);
    setTotalScoreSemester2(loadStudentGrades.totalScoreSemester2);
    setTotalFullScoreSemester2(loadStudentGrades.totalFullScoreSemester2);
    setEvaluationResult(loadStudentGrades.evaluationResult);
    setTotalScore(loadStudentGrades.totalScore);
    setGrade(loadStudentGrades.grade);

    console.log("ผลการเรียน:", loadStudentGrades);
  }, [studentGradesData, studentID]);

  const handleCancel = () => {
    navigate("/grade-management");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const studentGrade = {
        midtermScore1: midtermScore1,
        midtermFullScore1: midtermFullScore1,
        finalScore1: finalScore1,
        finalFullScore1: finalFullScore1,
        totalScoreSemester1: totalScoreSemester1,
        totalFullScoreSemester1: totalFullScoreSemester1,
        midtermScore2: midtermScore2,
        midtermFullScore2: midtermFullScore2,
        finalScore2: finalScore2,
        finalFullScore2: finalFullScore2,
        totalScoreSemester2: totalScoreSemester2,
        totalFullScoreSemester2: totalFullScoreSemester2,
        totalScore: totalScore,
        subjectIndicator1: subjectIndicator1,
        subjectIndicator2: subjectIndicator2,
        grade: grade,
        evaluationResult: evaluationResult,
      };

      await setDoc(doc(db, "student_grades", studentID), studentGrade);

      console.log("Data saved to FireStore!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTotalFullScoreSemester1(midtermFullScore1 + finalFullScore1);
  }, [midtermFullScore1, finalFullScore1]);

  useEffect(() => {
    setTotalScoreSemester1(midtermScore1 + finalScore1);
  }, [midtermScore1, finalScore1]);

  useEffect(() => {
    setTotalFullScoreSemester2(midtermFullScore2 + finalFullScore2);
  }, [midtermFullScore2, finalFullScore2]);

  useEffect(() => {
    setTotalScoreSemester2(midtermScore2 + finalScore2);
  }, [midtermScore2, finalScore2]);

  useEffect(() => {
    setTotalScore(totalScoreSemester1 + totalScoreSemester2);
  }, [totalScoreSemester1, totalScoreSemester2]);

  useEffect(() => {
    if (totalScore == null) return;

    let numericGrade = 0.0;

    if (totalScore >= 80) {
      numericGrade = 4.0;
    } else if (totalScore >= 75) {
      numericGrade = 3.5;
    } else if (totalScore >= 70) {
      numericGrade = 3.0;
    } else if (totalScore >= 65) {
      numericGrade = 2.5;
    } else if (totalScore >= 60) {
      numericGrade = 2.0;
    } else if (totalScore >= 55) {
      numericGrade = 1.5;
    } else if (totalScore >= 50) {
      numericGrade = 1.0;
    } else {
      numericGrade = 0.0;
    }

    setGrade(numericGrade);
  }, [totalScore]);

  return (
    <div style={{ background: "#BBBBBB" }}>
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
      <div className="px-5 py-2" style={{ height: "825px" }}>
        <div className="bg-white w-100 h-100 p-2">
          <div className="w-100 h-100 border border-success">
            <div className="d-flex border-bottom border-success">
              <div className="w-25 border-end border-success"></div>
              <div className="d-flex custom-h3 w-75">
                <div className="d-flex flex-column px-5 py-3 gap-1">
                  <div className="d-flex">
                    <div className="fw-bold me-5">เลขประจำตัวนักเรียน :</div>
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">ชื่อ-นามสกุล :</div>
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">ระดับ :</div>{" "}
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">คุณครูประจำชั้น :</div>
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">เบอร์โทรบิดา :</div>
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">เบอร์โทรมารดา :</div>
                  </div>
                  <div className="d-flex">
                    <div className="fw-bold me-5">เบอร์โทรผู้ปกครอง :</div>
                  </div>
                </div>
                <div className="d-flex flex-column px-5 py-3 gap-1">
                  <div>
                    <div>{student?.email?.replace("@gmail.com", "")}</div>
                  </div>
                  <div>
                    {student?.firstName} {student?.lastName}
                  </div>
                  <div>{student?.classLevel}</div>
                  <div>{student?.classTeacher}</div>
                  <div>{student?.fatherNum}</div>
                  <div>{student?.motherNum}</div>
                  <div>{student?.parentNum}</div>
                </div>
              </div>
            </div>
            <div
              className="d-flex justify-content-center pt-3 gap-1"
              style={{ height: "55px", background: "#F4BE50" }}
            >
              {buttons.map((label, index) => (
                <div
                  key={index}
                  className={`grade-management-butt ${
                    activeButton === index + 1 ? "active" : "inactive"
                  } custom-h4 d-flex p-1 justify-content-center align-items-center`}
                  style={{
                    width: "175px",
                    borderTopLeftRadius: "25px",
                    borderTopRightRadius: "25px",
                  }}
                  onClick={() => setActiveButton(index + 1)}
                >
                  {label}
                </div>
              ))}
            </div>
            <form onSubmit={handleSave}>
              <div
                className="d-flex flex-column"
                style={{ height: "483px", background: "#CEE8E4" }}
              >
                {activeButton === 1 && (
                  <div
                    className="d-flex gap-5 custom-h2 p-3"
                    style={{ height: "428px" }}
                  >
                    <div className="d-flex flex-column w-25 h-100 gap-1">
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%", transition: "500ms ease" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ภาคเรียนที่
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          1
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ตัวชี้วัด
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={subjectIndicator1}
                            onChange={(e) => {
                              setSubjectIndicator1(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ระหว่างเรียน
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={midtermScore1}
                            onChange={(e) => {
                              setMidtermScore1(Number(e.target.value));
                            }}
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={midtermFullScore1}
                            onChange={(e) => {
                              setMidtermFullScore1(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ปลายภาค
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={finalScore1}
                            onChange={(e) => {
                              setFinalScore1(Number(e.target.value));
                            }}
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={finalFullScore1}
                            onChange={(e) => {
                              setFinalFullScore1(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          รวม
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={totalScoreSemester1}
                            placeholder="Enter"
                            disabled
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={totalFullScoreSemester1}
                            placeholder="Enter"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column w-25 h-100 gap-1">
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ภาคเรียนที่
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          2
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ตัวชี้วัด
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={subjectIndicator2}
                            onChange={(e) => {
                              setSubjectIndicator2(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ระหว่างเรียน
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={midtermScore2}
                            onChange={(e) => {
                              setMidtermScore2(Number(e.target.value));
                            }}
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={midtermFullScore2}
                            onChange={(e) => {
                              setMidtermFullScore2(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ปลายภาค
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={finalScore2}
                            onChange={(e) => {
                              setFinalScore2(Number(e.target.value));
                            }}
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center"
                            placeholder="Enter"
                            value={finalFullScore2}
                            onChange={(e) => {
                              setFinalFullScore2(Number(e.target.value));
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          รวม
                        </div>
                        <div className="d-flex w-50 bg-white">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={totalScoreSemester2}
                            placeholder="Enter"
                            disabled
                          />
                          <div className="custom-h1 d-flex justify-content-center align-items-center">
                            /
                          </div>
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={totalFullScoreSemester2}
                            placeholder="Enter"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column w-25 h-100 gap-1">
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%", transition: "500ms ease" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          คะแนนรวมทั้งหมด
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={totalScore}
                            placeholder="Enter"
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          ระดับผลการเรียน
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          <Form.Control
                            type="number"
                            className="custom-h2 grade-input text-center bg-white"
                            value={grade}
                            placeholder="Enter"
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          สรุปผลการประเมิน
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          <select
                            className="grade-input text-center"
                            value={evaluationResult}
                            onChange={(e) =>
                              setEvaluationResult(e.target.value)
                            }
                          >
                            <option value="" disabled>
                              -- เลือก --
                            </option>
                            <option value="ผ่าน">ผ่าน</option>
                            <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                          </select>
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%", opacity: "0" }}
                      >
                        <div className="d-flex align-items-center justify-content-center w-50">
                          อันดับของห้อง
                        </div>
                        <div className="d-flex align-items-center justify-content-center bg-white w-50 h-100">
                          1
                        </div>
                      </div>
                      <div
                        className="d-flex bg-success w-100 p-1"
                        style={{ height: "20%", opacity: "0" }}
                      ></div>
                    </div>
                  </div>
                )}
                <div
                  className="d-flex justify-content-end p-2 gap-1"
                  style={{ height: "55px" }}
                >
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{ width: "100px", borderRadius: "20px" }}
                    onClick={handleCancel}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ width: "100px", borderRadius: "20px" }}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default GradeManagementStudent;
