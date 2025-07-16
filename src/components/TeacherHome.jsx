import React from "react";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

function TeacherHome() {
  return (
    <div className="screen">
      <Navbar />
      <div className="page-detail">
        Teacher Homepage
      </div>
      <Footer />
    </div>
  );
}

export default TeacherHome;
