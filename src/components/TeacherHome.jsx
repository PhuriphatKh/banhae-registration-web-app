import React from "react";
import HomePageDetail from "./HomePageDetail";
import Navbar from "./Navbar";
import Footer from "./Footer";

function TeacherHome() {
  return (
    <div className="screen">
      <Navbar />
      <HomePageDetail />
      <Footer />
    </div>
  );
}

export default TeacherHome;
