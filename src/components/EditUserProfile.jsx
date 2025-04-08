import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import logo from "../assets/logo.png";

function EditUserProfile() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [profileData, setProfileData] = useState();

  const { logOut, user, firstName, lastName } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  useEffect(() => {
    const editUserProfile = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("id");
        setId(id);
      } catch (error) {
        console.log(error);
      }
    };

    editUserProfile();
  }, []);

  useEffect(() => {
    if (id) {
      const unsubscribe = loadRealtime();
      return () => {
        unsubscribe();
      };
    }
  }, [id]);

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

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(doc(db, "profile", id), (snapshot) => {
      const newData = snapshot.data();
      setProfileData(newData);
      setEmail(newData.email);
    });

    return () => {
      unsubscribe();
    };
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSave = async () => {
    try {
      await setDoc(
        doc(db, "profile", id),
        {
          email: email,
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  console.log("prifiledata:", profileData);

  return (
    <div className="screen">
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
            <div className={`menu-1-dropdown ${open2 ? "active" : "inactive"}`}>
              <div className="custom-h5 d-flex flex-column align-items-end">
                <Link to={"/profile"} className="text-black">
                  ข้อมูลส่วนตัว
                </Link>
                <Link to={"/usermanagement"} className="text-black">
                  จัดการข้อมูลผู้ใช้
                </Link>
                <Link to={"/student-table-management"} className="text-black">
                  จัดการตารางเรียน
                </Link>
                <Link to={"/teacher-table-management"} className="text-black">
                  จัดการตารางสอน
                </Link>
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
              } d-flex justify-content-end align-items-center`}
            >
              <div className="custom-h5">
                <Link to="/school-record-management" className="text-black">
                  จัดการผลการเรียน
                </Link>
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
      <div className="d-flex flex-column">
        <div className="m-1">{}</div>
        <input
          className="m-1"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="m-1" onClick={() => handleSave()}>
          บันทึก
        </button>
      </div>
      <div className="footer position-absolute bottom-0 w-100">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default EditUserProfile;
