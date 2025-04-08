import React, { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import logo from "./assets/logo.png";
import viteLogo from "/vite.svg";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "./context/UserAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, user, userPermission } = useUserAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email && !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน!");
      return;
    }

    if (!email) {
      setError("กรุณากรอกชื่อผู้ใช้!");
      return;
    }

    if (!password) {
      setError("กรุณากรอกรหัสผ่าน!");
      return;
    }

    try {
      const userCredential = await logIn(email + "@gmail.com", password);
      const user = userCredential.user;
      const position = await userPermission(user);
      navigate(`/home/${position}`);
    } catch (err) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!");
      console.log(err);
    }
  };

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

        <div className="dropdown-container" ref={menuRef}>
          <div
            className="dropdown-trigger"
            onClick={() => {
              setOpen(!open);
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

            <div className="custom-h5">เข้าสู่ระบบ</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`dropdown-menu-1 ${open ? "active" : "inactive"}`}>
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

              <input
                type="text"
                className="input-style"
                placeholder="ชื่อผู้ใช้งาน"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="input-style"
                placeholder="รหัสผ่าน"
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <div className="h6 alert alert-danger p-2 m-0">{error}</div>
              )}
              <button className="login-button" type="submit">
                <div className="custom-h5">เข้าสู่ระบบ</div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="detail-container">
        <div className="pic-container">รูปภาพ</div>

        <div className="news-header-container custom-h2">
          ข่าวสารกิจกรรมโรงเรียนบ้านแฮะ
        </div>

        <div className="news-container"></div>
      </div>

      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default App;
