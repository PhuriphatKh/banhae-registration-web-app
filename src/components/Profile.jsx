import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Button, Row, Col } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import logo from "../assets/logo.png";
import "./Profile.css";

function Profile() {
  const [profileID, setProfileID] = useState("");
  const [profileData, setProfileData] = useState({
    profile: {
      user: {
        studentID: "-",
        teacherID: "-",
        firstName: "-",
        lastName: "-",
        position: "-",
        classLevel: "-",
        birthDate: "-",
        ethnicity: "-",
        nationality: "-",
        religion: "-",
      },
      father: {
        fullName: "-",
        occupation: "-",
        monthlyIncome: "-",
      },
      mother: {
        fullName: "-",
        occupation: "-",
        monthlyIncome: "-",
      },
      parent: {
        fullName: "-",
        occupation: "-",
        monthlyIncome: "-",
      },
    },

    address: {
      user: {
        houseNum: "-",
        villageNum: "-",
        villageName: "-",
        road: "-",
        subDistrict: "-",
        subDistrictName: "-",
        district: "-",
        districtName: "-",
        province: "-",
        provinceName: "-",
        zipcode: "-",
        teleNum: "-",
      },
      father: {
        houseNum: "-",
        villageNum: "-",
        villageName: "-",
        road: "-",
        subDistrict: "-",
        subDistrictName: "-",
        district: "-",
        districtName: "-",
        province: "-",
        provinceName: "-",
        zipcode: "-",
        fatherNum: "-",
      },
      mother: {
        houseNum: "-",
        villageNum: "-",
        villageName: "-",
        road: "-",
        subDistrict: "-",
        subDistrictName: "-",
        district: "-",
        districtName: "-",
        province: "-",
        provinceName: "-",
        zipcode: "-",
        motherNum: "-",
      },
      parent: {
        houseNum: "-",
        villageNum: "-",
        villageName: "-",
        road: "-",
        subDistrict: "-",
        subDistrictName: "-",
        district: "-",
        districtName: "-",
        province: "-",
        provinceName: "-",
        zipcode: "-",
        parentNum: "-",
      },
    },
  });

  useEffect(() => {
    if (!profileID) return;

    const unsubscribe = onSnapshot(
      doc(db, "profile", profileID),
      (snapshot) => {
        const newData = snapshot.data();
        if (!newData) return;

        setProfileData((prev) => ({
          ...prev,
          profile: {
            user: {
              studentID: newData.user?.studentID || "-",
              teacherID: newData.user?.teacherID || "-",
              firstName: newData.user?.firstName || "-",
              lastName: newData.user?.lastName || "-",
              position: newData.user?.position || "-",
              classLevel: newData.user?.classLevel || "-",
              taughtSubject: newData.user?.taughtSubject || [],
              birthDate: newData.user?.birthDate || "-",
              ethnicity: newData.user?.ethnicity || "-",
              nationality: newData.user?.nationality || "-",
              religion: newData.user?.religion || "-",
            },
            father: {
              firstName: newData.father?.fullName?.split(" ")[0] || "-",
              lastName: newData.father?.fullName?.split(" ")[1] || "-",
              occupation: newData.father?.occupation || "-",
              monthlyIncome: newData.father?.monthlyIncome || "-",
            },
            mother: {
              firstName: newData.mother?.fullName?.split(" ")[0] || "-",
              lastName: newData.mother?.fullName?.split(" ")[1] || "-",
              occupation: newData.mother?.occupation || "-",
              monthlyIncome: newData.mother?.monthlyIncome || "-",
            },
            parent: {
              firstName: newData.parent?.fullName?.split(" ")[0] || "-",
              lastName: newData.parent?.fullName?.split(" ")[1] || "-",
              occupation: newData.parent?.occupation || "-",
              monthlyIncome: newData.parent?.monthlyIncome || "-",
            },
          },
        }));

        console.log("Profile data updated:", newData);
      }
    );

    return () => unsubscribe();
  }, [profileID]);

  useEffect(() => {
    if (!profileID) return;

    const unsubscribe = onSnapshot(
      doc(db, "address", profileID),
      (snapshot) => {
        const newData = snapshot.data();
        if (!newData) return;

        setProfileData((prev) => ({
          ...prev,
          address: {
            user: { ...prev.address.user, ...newData.user },
            father: { ...prev.address.father, ...newData.father },
            mother: { ...prev.address.mother, ...newData.mother },
            parent: { ...prev.address.parent, ...newData.parent },
          },
        }));

        console.log("Address data updated:", newData);
      }
    );

    return () => unsubscribe();
  }, [profileID]);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { logOut, user, firstName, lastName, userRole } = useUserAuth();
  const navigate = useNavigate();

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  const location = useLocation();

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
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) setProfileID(id);
  }, [location.search]);

  return (
    <div className="profile-page">
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
      <div className="profile-detail">
        <div className="profile-section">
          <div className="profile-title">ข้อมูลส่วนตัว</div>
          <table className="profile-table">
            <tbody>
              <tr>
                <th>ชื่อ-สกุล</th>
                <td>
                  {profileData.profile.user.firstName}{" "}
                  {profileData.profile.user.lastName}
                </td>
              </tr>
              <tr>
                <th>ตำแหน่ง</th>
                <td>{profileData.profile.user.position}</td>
              </tr>
              <tr>
                <th>
                  {profileData.profile.user.position === "นักเรียน"
                    ? "ระดับการศึกษา"
                    : "วิชาที่สอน"}
                </th>
                <td>
                  {profileData.profile.user.position === "นักเรียน"
                    ? profileData.profile.user.classLevel
                    : profileData.profile.user.taughtSubject}
                </td>
              </tr>
              <tr>
                <th>เกิดวันที่</th>
                <td>
                  {profileData.profile.user.birthDate
                    ? new Date(
                        profileData.profile.user.birthDate
                      ).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>เชื้อชาติ</th>
                <td>{profileData.profile.user.ethnicity}</td>
              </tr>
              <tr>
                <th>สัญชาติ</th>
                <td>{profileData.profile.user.nationality || "-"}</td>
              </tr>
              <tr>
                <th>ศาสนา</th>
                <td>{profileData.profile.user.religion || "-"}</td>
              </tr>
            </tbody>
          </table>
          <div className="profile-title mt-3">ที่อยู่ปัจจุบัน</div>
          <table className="profile-table">
            <tbody>
              <tr className="group-user">
                <th>บ้านเลขที่</th>
                <td>{profileData.address?.user?.houseNum || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>หมู่ที่</th>
                <td>{profileData.address?.user?.villageNum || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>ชื่อหมู่บ้าน</th>
                <td>{profileData.address?.user?.villageName || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>ถนน/ตรอก/ซอย</th>
                <td>{profileData.address?.user?.road || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>ตำบล/แขวง</th>
                <td>{profileData.address?.user?.subDistrictName || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>อำเภอ/เขต</th>
                <td>{profileData.address?.user?.districtName || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>จังหวัด</th>
                <td>{profileData.address?.user?.provinceName || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>รหัสไปรษณีย์</th>
                <td>{profileData.address?.user?.zipcode || "-"}</td>
              </tr>
              <tr className="group-user">
                <th>เบอร์โทรศัพท์</th>
                <td>{profileData.address?.user?.teleNum || "-"}</td>
              </tr>
            </tbody>
          </table>
          { profileData.profile.user.position === "นักเรียน" ? (
            <>
              <div className="profile-title mt-3">ข้อมูลครอบครัว</div>
              <table className="profile-table">
                <tbody>
                  <tr className="section-header">
                    <th colSpan={2}>บิดา</th>
                  </tr>
                  <tr className="group-father">
                    <th>ชื่อ-สกุล</th>
                    <td>
                      {profileData.profile.father.firstName}{" "}
                      {profileData.profile.father.lastName}
                    </td>
                  </tr>
                  <tr className="group-father">
                    <th>อาชีพ</th>
                    <td>{profileData.profile.father.occupation || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>รายได้/เดือน</th>
                    <td>{profileData.profile.father.monthlyIncome || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>บ้านเลขที่</th>
                    <td>{profileData.address?.father?.houseNum || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>หมู่ที่</th>
                    <td>{profileData.address?.father?.villageNum || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>ถนน/ตรอก/ซอย</th>
                    <td>{profileData.address?.father?.road || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>ตำบล/แขวง</th>
                    <td>{profileData.address?.father?.subDistrictName || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>อำเภอ/เขต</th>
                    <td>{profileData.address?.father?.districtName || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>จังหวัด</th>
                    <td>{profileData.address?.father?.provinceName || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>รหัสไปรษณีย์</th>
                    <td>{profileData.address?.father?.zipcode || "-"}</td>
                  </tr>
                  <tr className="group-father">
                    <th>เบอร์โทรศัพท์</th>
                    <td>{profileData.address?.father?.fatherNum || "-"}</td>
                  </tr>

                  <tr className="section-header">
                    <th colSpan={2}>มารดา</th>
                  </tr>              
                  <tr className="group-mother">
                    <th>ชื่อ-สกุล</th>
                    <td>
                      {profileData.profile.mother.firstName}{" "}
                      {profileData.profile.mother.lastName}
                    </td>
                  </tr>
                  <tr className="group-mother">
                    <th>อาชีพ</th>
                    <td>{profileData.profile.mother.occupation || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>รายได้/เดือน</th>
                    <td>{profileData.profile.mother.monthlyIncome || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>บ้านเลขที่</th>
                    <td>{profileData.address?.mother?.houseNum || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>หมู่ที่</th>
                    <td>{profileData.address?.mother?.villageNum || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>ถนน/ตรอก/ซอย</th>
                    <td>{profileData.address?.mother?.road || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>ตำบล/แขวง</th>
                    <td>{profileData.address?.mother?.subDistrictName || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>อำเภอ/เขต</th>
                    <td>{profileData.address?.mother?.districtName || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>จังหวัด</th>
                    <td>{profileData.address?.mother?.provinceName || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>รหัสไปรษณีย์</th>
                    <td>{profileData.address?.mother?.zipcode || "-"}</td>
                  </tr>
                  <tr className="group-mother">
                    <th>เบอร์โทรศัพท์</th>
                    <td>{profileData.address?.mother?.motherNum || "-"}</td>
                  </tr>

                  <tr className="section-header">
                    <th colSpan={2}>ผู้ปกครอง</th>
                  </tr>
                  <tr className="group-parent">
                    <th>ชื่อ-สกุล</th>
                    <td>
                      {profileData.profile.parent.firstName}{" "}
                      {profileData.profile.parent.lastName}
                    </td>
                  </tr>
                  <tr className="group-parent">
                    <th>อาชีพ</th>
                    <td>{profileData.profile.parent.occupation || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>รายได้/เดือน</th>
                    <td>{profileData.profile.parent.monthlyIncome || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>บ้านเลขที่</th>
                    <td>{profileData.address?.parent?.houseNum || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>หมู่ที่</th>
                    <td>{profileData.address?.parent?.villageNum || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>ถนน/ตรอก/ซอย</th>
                    <td>{profileData.address?.parent?.road || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>ตำบล/แขวง</th>
                    <td>{profileData.address?.parent?.subDistrictName || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>อำเภอ/เขต</th>
                    <td>{profileData.address?.parent?.districtName || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>จังหวัด</th>
                    <td>{profileData.address?.parent?.provinceName || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>รหัสไปรษณีย์</th>
                    <td>{profileData.address?.parent?.zipcode || "-"}</td>
                  </tr>
                  <tr className="group-parent">
                    <th>เบอร์โทรศัพท์</th>
                    <td>{profileData.address?.parent?.parentNum || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : null }
          
        </div>
      </div>
      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default Profile;
