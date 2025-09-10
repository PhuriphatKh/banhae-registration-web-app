import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import "./StudentRecords.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function StudentRecords() {
  const [year, setYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [switchDisplay, setSwitchDisplay] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentProfile, setStudentProfile] = useState(null);
  const [classLevel, setClassLevel] = useState("");
  const [recordData, setRecordData] = useState(null);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const { user } = useUserAuth();

  // Get the subjects
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "school_record"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setYear(data);
        console.log("Year data updated:", data);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user.uid) return;

    const unsubscribe = onSnapshot(doc(db, "profile", user.uid), (snapshot) => {
      const newData = snapshot.data();
      if (!newData) return;
      setStudentProfile(newData.user || {});
      setClassLevel(newData.user.classLevel || "");
      setStudentId(newData.user.studentID || "");
    });

    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    if (!classLevel && !selectedYear) return;

    const colRef = collection(
      db,
      "school_record",
      String(selectedYear),
      String(classLevel)
    );

    const unsubscribe = onSnapshot(colRef, (qSnap) => {
      const rows = qSnap.docs
        .map((d) => {
          const data = d.data();
          const stu = data?.students?.[studentId];
          if (!stu) return null;
          return {
            subjectId: data.id ?? d.id,
            studentId: studentId,
            student: stu,
            scoring_criteria: data.scoring_criteria,
            grading_criteria: data.grading_criteria,
          };
        })
        .filter(Boolean);

      setRecordData(rows);
      console.log("Only this student's records:", rows);
    });

    return unsubscribe;
  }, [db, classLevel, studentId, selectedYear]);

  const handleWatchRecords = async (e, yearId) => {
    setSelectedYear(yearId);
    setSwitchDisplay(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubject(data);
      console.log("Subjects data updated:", data);
    });

    return () => unsubscribe();
  }, []);

  const gpa = useMemo(() => {
    if (!recordData || recordData.length === 0) return "-";
    const sum = recordData.reduce(
      (acc, row) => acc + Number(row.student?.result || 0),
      0
    );
    return (sum / recordData.length).toFixed(2); // ปัดทศนิยม 2 ตำแหน่ง
  }, [recordData]);

  return (
    <div style={{ backgroundColor: "#d9d9d9" }}>
      <Navbar />
      <div className="student-records">
        <div className="student-records-detail">
          <div className="custom-h1 fw-bold">ผลคะแนนรายวิชา</div>
          <hr />
          <div className="d-flex flex-column justify-content-start align-items-start gap-1 custom-h3 fw-bold mb-3 ms-3">
            <div>รหัสนักเรียน: {studentId}</div>
            <div>
              ชื่อ - สกุล: {studentProfile?.firstName ?? ""}{" "}
              {studentProfile?.lastName ?? ""}
            </div>
            <div>ชั้น: {studentProfile?.classLevel ?? ""}</div>
            <div>เกรดเฉลี่ยสะสม (GPA): {studentProfile?.gpa ?? "-"}</div>
          </div>

          {!switchDisplay ? (
            <table className="student-records-table">
              <thead>
                <tr>
                  <th>ปีการศึกษา</th>
                  <th>คะแนนเก็บ</th>
                </tr>
              </thead>
              <tbody>
                {year.map((item) => (
                  <tr key={item.id}>
                    <td className="w-50">{item.id}</td>
                    <td className="w-50">
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <button
                          onClick={(e) => handleWatchRecords(e, item.id)}
                          className="view-button"
                        >
                          ดูคะแนน
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <table className="student-records-table-2">
                <thead>
                  <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>คะแนนเต็ม</th>
                    <th>คะแนนที่ได้</th>
                    <th>ระดับผลการเรียน</th>
                  </tr>
                </thead>
                <tbody>
                  {recordData.map((row, idx) => (
                    <tr key={row.subjectId}>
                      <td>{row.subjectId}</td>
                      <td>
                        {subject.find((sub) => sub.id === row.subjectId)?.name}
                      </td>
                      <td>{row.scoring_criteria.grandTotal}</td>
                      <td>{row.student.grandTotal}</td>
                      <td>{row.student.result}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#efefef" }}>
                    <td className="text-center border-end" colSpan={3}></td>
                    <td className="text-center fw-bold border-start border-end">เกรดเฉลี่ย</td>
                    <td className="text-center fw-bold border-start">{gpa}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                  className="delete-butt"
                  onClick={() => setSwitchDisplay(false)}
                >
                  กลับ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StudentRecords;
