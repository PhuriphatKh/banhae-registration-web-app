import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regPosition, setRegPosition] = useState("");
  const [regClassLevel, setRegClassLevel] = useState("-");
  const [regReligion, setRegReligion] = useState("");
  const [regNationality, setRegNationality] = useState("");
  const [regBirthday, setRegBirthday] = useState("");
  const [regTeleNum, setRegTeleNum] = useState("");
  const [regFatherName, setRegFatherName] = useState("");
  const [regMotherName, setRegMotherName] = useState("");
  const [regParentName, setRegParentName] = useState("");
  const [regFatherNum, setRegFatherNum] = useState("");
  const [regMotherNum, setRegMotherNum] = useState("");
  const [regParentNum, setRegParentNum] = useState("");
  const [regVillageName, setRegVillageName] = useState("");
  const [regHouseNum, setRegHouseNum] = useState("");
  const [regVillageNum, setRegVillageNum] = useState("");
  const [regRoad, setRegRoad] = useState("");
  const [regSubDistrict, setRegSubDistrict] = useState("");
  const [regDistrict, setRegDistrict] = useState("");
  const [regProvince, setRegProvince] = useState("");
  const [regZipcode, setRegZipcode] = useState("");

  const [error, setError] = useState("");
  const { signUp, logOut, firstName, lastName } = useUserAuth();

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  let navigate = useNavigate();
  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await signUp(email, password);

      const userProfile = {
        email: user.email,
        firstName: regFirstName,
        lastName: regLastName,
        position: regPosition,
        classLevel: regClassLevel,
        religion: regReligion,
        nationality: regNationality,
        birthday: regBirthday,
        teleNum: regTeleNum,
        fatherName: regFatherName,
        motherName: regMotherName,
        parentName: regParentName,
        fatherNum: regFatherNum,
        motherNum: regMotherNum,
        parentNum: regParentNum,
        createdAt: new Date(),
      };

      const userAddress = {
        villageName: regVillageName,
        houseNum: regHouseNum,
        villageNum: regVillageNum,
        road: regRoad,
        subDistrict: regSubDistrict,
        district: regDistrict,
        province: regProvince,
        zipcode: regZipcode,
        createdAt: new Date(),
      };

      await setDoc(doc(db, "profile", user.uid), userProfile);
      await setDoc(doc(db, "address", user.uid), userAddress);

      console.log("User registered and data saved to FireStore!");

      navigate("/register");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="">
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

      <Form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center p-5 rounded-4 gap-2"
        style={{ backgroundColor: "aliceblue", height: "825px" }}
      >
        <div className="custom-h2 fw-bold">เพิ่มข้อมูลผู้ใช้</div>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex flex-column gap-1" style={{ width: "924px" }}>
          <div className="custom-h3 fw-bold">ข้อมูลส่วนตัว</div>
          <div className="d-flex gap-4 w-0">
            <Form.Group className="mb-3">
              <Form.Label>ชื่อ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                onChange={(e) => setRegFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>สกุล</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                onChange={(e) => setRegLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ตำแหน่ง</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegPosition(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ระดับชั้น (เฉพาะนักเรียน)</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegClassLevel(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ศาสนา</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegReligion(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>สัญชาติ</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegNationality(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>วันเกิด</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegBirthday(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>เบอร์โทรศัพท์</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegTeleNum(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ชื่อบิดา</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegFatherName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ชื่อมารดา</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegMotherName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ชื่อผู้ปกครอง</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegParentName(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>เบอร์โทรบิดา</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegFatherNum(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>เบอร์โทรมารดา</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegMotherNum(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>เบอร์โทรผู้ปกครอง</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegParentNum(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>

        <div className="d-flex flex-column gap-1" style={{ width: "924px" }}>
          <div className="custom-h3 fw-bold">ที่อยู่</div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ชื่อหมู่บ้าน</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegVillageName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>บ้านเลขที่</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegHouseNum(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>หมู่ที่</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegVillageNum(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ถนน/ตรอก/ซอย</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegRoad(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>ตำบล/แขวง</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegSubDistrict(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>อำเภอ/เขต</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegDistrict(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="d-flex gap-4" style={{ width: "924px" }}>
            <Form.Group className="mb-3 w-50">
              <Form.Label>จังหวัด</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegProvince(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 w-50">
              <Form.Label>รหัสไปรษณีย์</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={(e) => setRegZipcode(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>

      <div className="footer w-100">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default Register;
