import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./GradeManagement.css"
import Navbar from "./Navbar";
import Footer from "./Footer";

function GradeManagement() {
  const [subjects, setSubjects] = useState([]);
  const [taughtSubject, setTaughtSubject] = useState([]);

  const navigate = useNavigate();
  const { profileData } = useUserProfile();
  const { user } = useUserAuth();

  // Get the subjects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(data);
      console.log("Subjects data updated:", data);
    });

    return () => unsubscribe(); // ยกเลิกเมื่อ component unmount
  }, []);

  // Get the subjects taught by the teacher
  useEffect(() => {
    if (!profileData) return;

    const loadTeacher = profileData.find((item) => item.id === user.uid);
    if (loadTeacher) {
      setTaughtSubject(loadTeacher.user.taughtSubject);
    }
  }, [profileData]);

  const handleSubjectClick = (subjectId) => {
    navigate(`/grade-management/subject?id=${subjectId}`);
  };

  return (
    <div style={{ background: "#BBBBBB" }}>
      <Navbar />
      <div className="p-3 page-detail">
        <div className="grade-table bg-white page-detail-box">
          <div className="d-flex justify-content-center custom-h1 fw-bold">
            จัดการคะแนนรายวิชา
          </div>
          <div className="custom-h2 d-flex align-items-center w-100">
            เลือกวิชาที่ต้องการจัดการคะแนน
          </div>
          <table className="p-5 w-100 h-100">
            <thead>
              <tr>
                <th
                  className="text-center"
                  width="33.33%"
                  style={{ borderTopLeftRadius: "20px" }}
                >
                  รหัสวิชา
                </th>
                <th
                  className="text-center border-start border-end"
                  width="33.33%"
                  style={{ borderColor: "#ddd" }}
                >
                  ชื่อวิชา
                </th>
                <th
                  className="text-center"
                  width="33.33%"
                  style={{ borderTopRightRadius: "20px" }}
                >
                  ระดับชั้นเรียน
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects
                .filter((subject) => taughtSubject.includes(subject.id))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((subject) => (
                  <tr key={subject.id}>
                    <td
                      className="text-center"
                      onClick={() => handleSubjectClick(subject.id)}
                    >
                      {subject.id}
                    </td>
                    <td
                      className="text-center border-start border-end"
                      style={{ borderColor: "#ddd" }}
                      onClick={() => handleSubjectClick(subject.id)}
                    >
                      {subject.name}
                    </td>
                    <td
                      className="text-center"
                      onClick={() => handleSubjectClick(subject.id)}
                    >
                      {subject.classLevel}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GradeManagement;
