import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

function StudentHome() {
  return (
    <div className="screen">
      <Navbar />
      <div className="page-detail">Student Homepage</div>
      <Footer />
    </div>
  );
}

export default StudentHome;
