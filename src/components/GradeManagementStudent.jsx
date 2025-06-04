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
          <div ref={menuRef2}>
            <div
              className="menu-1"
              onClick={() => {
                setOpen2(!open2);
              }}
            >
              <div className="custom-h5">ทะเบียน</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g clipPath="url(#clip0_282_2287)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_282_2287">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              className={`menu-1-dropdown ${
                open2 ? "active" : "inactive"
              } teacher-dropdown-menu-1`}
            >
              <div className="custom-h5 d-flex flex-column align-items-end">
                <Link to={"/profile"} className="text-black">
                  ข้อมูลส่วนตัว
                </Link>
                {userRole === "admin" && (
                  <>
                    <Link to="/usermanagement" className="text-black">
                      จัดการข้อมูลผู้ใช้
                    </Link>
                    <Link to="/student-table-management" className="text-black">
                      จัดการตารางเรียน
                    </Link>
                    <Link
                      to={"/teacher-table-management"}
                      className="text-black"
                    >
                      จัดการตารางสอน
                    </Link>
                  </>
                )}
                {userRole === "นักเรียน" && (
                  <Link to="/student-table" className="text-black">
                    ตารางเรียน
                  </Link>
                )}
                {userRole === "ครู" && (
                  <Link to="/teacher-table" className="text-black">
                    ตารางสอน
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div ref={menuRef3}>
            <div
              className="menu-2"
              onClick={() => {
                setOpen3(!open3);
              }}
            >
              <div className="custom-h5">ประมวณผลการเรียน</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <g clipPath="url(#clip0_282_2287)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_282_2287">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              className={`menu-2-dropdown ${
                open3 ? "active" : "inactive"
              } teacher-dropdown-menu-2`}
            >
              <div className="custom-h5 d-flex flex-column align-items-end">
                {userRole === "admin" && (
                  <Link to="/school-record-management" className="text-black">
                    จัดการผลการเรียน
                  </Link>
                )}
                {userRole === "นักเรียน" && (
                  <Link to="/school-record-management" className="text-black">
                    ผลคะแนนรายวิชา
                  </Link>
                )}
                {userRole === "ครู" && (
                  <Link to="/grade-management" className="text-black">
                    จัดการคะแนนรายวิชา
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="menu-3">
            <div className="custom-h5">คำร้อง</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <g clipPath="url(#clip0_282_2287)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.5599 16.06C13.2787 16.3409 12.8974 16.4987 12.4999 16.4987C12.1024 16.4987 11.7212 16.3409 11.4399 16.06L5.7819 10.404C5.50064 10.1226 5.34268 9.74101 5.34277 9.34315C5.34287 8.94529 5.50101 8.56377 5.7824 8.2825C6.06379 8.00124 6.4454 7.84328 6.84325 7.84338C7.24111 7.84347 7.62264 8.00161 7.9039 8.283L12.4999 12.879L17.0959 8.283C17.3787 8.00963 17.7575 7.85826 18.1508 7.86149C18.5441 7.86472 18.9204 8.0223 19.1986 8.30028C19.4769 8.57826 19.6348 8.95441 19.6384 9.3477C19.642 9.741 19.491 10.12 19.2179 10.403L13.5609 16.061L13.5599 16.06Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_282_2287">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>

        <div className="dropdown-container" ref={menuRef1}>
          <div
            className="dropdown-trigger"
            onClick={() => {
              setOpen1(!open1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="21"
              viewBox="0 0 17 21"
              fill="none"
            >
              <g clipPath="url(#clip0_1_313)">
                <path
                  d="M0.5 21C0.5 18.8783 1.34285 16.8434 2.84315 15.3431C4.34344 13.8429 6.37827 13 8.5 13C10.6217 13 12.6566 13.8429 14.1569 15.3431C15.6571 16.8434 16.5 18.8783 16.5 21H0.5ZM8.5 12C5.185 12 2.5 9.315 2.5 6C2.5 2.685 5.185 0 8.5 0C11.815 0 14.5 2.685 14.5 6C14.5 9.315 11.815 12 8.5 12Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_313">
                  <rect
                    width="16"
                    height="21"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <div className="custom-h5">{firstName}</div>
          </div>

          <form>
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
              <div className="custom-h5">
                {firstName} {lastName}
              </div>
              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
              >
                <div className="custom-h6">ออกจากระบบ</div>
              </button>
            </div>
          </form>
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
