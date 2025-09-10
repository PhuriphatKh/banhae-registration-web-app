import React, { useEffect, useState } from "react";
import { useUserProfile } from "../context/ProfileDataContex";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Row, Col } from "react-bootstrap";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "./ManagerHome.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

function ManagerHome() {
  const { profileData } = useUserProfile();
  const [personnelCounts, setPersonnelCounts] = useState({});
  const [studentCounts, setStudentCounts] = useState({});
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStudentYear, setSelectedStudentYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "school_record"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAcademicYears(data);
      }
    );

    return () => unsubscribe();
  }, []);

  // subscribe approval requests
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "approval_requests"), (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // sort newest first
      items.sort((a, b) => {
        const ta =
          a.createdAt && typeof a.createdAt.toDate === "function"
            ? a.createdAt.toDate().getTime()
            : a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;
        const tb =
          b.createdAt && typeof b.createdAt.toDate === "function"
            ? b.createdAt.toDate().getTime()
            : b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;
        return tb - ta;
      });
      setApprovalRequests(items);
    });
    return () => unsub();
  }, []);

  // helper: extract year (AD) from firebase Timestamp / Date / ISO string
  const getItemYear = (createdAt) => {
    if (!createdAt) return null;
    if (typeof createdAt.toDate === "function") {
      return createdAt.toDate().getFullYear();
    }
    const d = new Date(createdAt);
    return Number.isNaN(d.getTime()) ? null : d.getFullYear();
  };

  useEffect(() => {
    if (!profileData) return;

    // targets for separate filters
    const targetPersonnelYear = selectedYear ? Number(selectedYear) : null;
    const targetStudentYear = selectedStudentYear
      ? Number(selectedStudentYear)
      : null;

    // aggregate personnel (non-students) filtered by selectedYear
    const personnelAgg = (profileData || []).reduce((acc, item) => {
      const user = item.user;
      if (!user?.position) return acc;

      if (targetPersonnelYear) {
        const itemYear = getItemYear(item?.createdAt);
        if (itemYear == null) return acc;
        if (
          !(
            itemYear === targetPersonnelYear ||
            itemYear + 543 === targetPersonnelYear
          )
        )
          return acc;
      }

      if (user.position !== "นักเรียน") {
        acc[user.position] = (acc[user.position] || 0) + 1;
      }

      return acc;
    }, {});

    // aggregate students (by classLevel) filtered by selectedStudentYear
    const studentAgg = (profileData || []).reduce((acc, item) => {
      const user = item.user;
      if (!user?.position) return acc;
      if (user.position !== "นักเรียน") return acc;

      if (targetStudentYear) {
        const itemYear = getItemYear(item?.createdAt);
        if (itemYear == null) return acc;
        if (
          !(
            itemYear === targetStudentYear ||
            itemYear + 543 === targetStudentYear
          )
        )
          return acc;
      }

      const key = user.classLevel || "ไม่ระบุชั้น";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    setPersonnelCounts(personnelAgg);
    setStudentCounts(studentAgg);
  }, [profileData, selectedYear, selectedStudentYear]);

  // data for personnel chart
  const data = Object.entries(personnelCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const studentData = Object.entries(studentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div
      className="screen manager-screen"
      style={{ backgroundColor: "#f0f2f5" }}
    >
      <Navbar />
      <div className="manager-page-detail p-5">
        <div className="bg-white p-4 rounded shadow-sm">
          <Row>
            <Col>
              <div className="d-flex align-items-center gap-3">
                <h2 className="fw-bold mb-0">Dashboard</h2>
                {approvalRequests.length > 0 && (
                  <div className="badge bg-warning text-dark">
                    คำร้องรออนุมัติ:{" "}
                    {
                      approvalRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {/* show recent approval requests */}
          <Row className="mt-3">
            <Col>
              <h5 className="mb-2">คำร้องขออนุมัติล่าสุด</h5>
              {approvalRequests.length ? (
                <ul className="list-unstyled mb-3">
                  {approvalRequests.slice(0, 6).map((r) => (
                    <li key={r.id} className="py-1">
                      <strong>{r.type}</strong> — {r.subjectID} / {r.classLevel}{" "}
                      —{" "}
                      <span className="text-muted">
                        {r.requesterName ?? r.requesterUid ?? "ไม่ระบุ"} •{" "}
                        {r.createdAt
                          ? typeof r.createdAt.toDate === "function"
                            ? r.createdAt.toDate().toLocaleString("th-TH")
                            : new Date(r.createdAt).toLocaleString("th-TH")
                          : "-"}
                      </span>{" "}
                      <span
                        className={`badge ${
                          r.status === "pending"
                            ? "bg-warning text-dark"
                            : r.status === "approved"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted mb-3">ไม่มีคำร้อง</div>
              )}
            </Col>
          </Row>
          <hr />
          <Row className="gap-4 justify-content-center">
            <Col md={6} className="graph-box">
              <Row>
                <Col md={12} className="d-flex gap-2">
                  <div
                    className="custom-h2 fw-bold align-self-center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    ข้อมูลบุคลากรทั้งหมดประจำ
                  </div>
                  <select
                    className="modern-select"
                    style={{ width: "170px" }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {academicYears
                      .slice() // clone to avoid mutating state
                      .sort((a, b) => Number(b.id) - Number(a.id)) // id มาก -> น้อย
                      .map((year) => (
                        <option key={year.id} value={year.id}>
                          ปีการศึกษา {year.id}
                        </option>
                      ))}
                  </select>
                </Col>
              </Row>
              <Row className="mt-3" style={{ height: 300 }}>
                <Col md={5}>
                  <ul>
                    {Object.entries(personnelCounts).length ? (
                      Object.entries(personnelCounts).map(([pos, count]) => (
                        <li key={pos}>
                          {pos}: {count} คน
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">ไม่มีข้อมูลบุคลากร</li>
                    )}
                  </ul>
                </Col>
                <Col md={7} className="h-100">
                  <div
                    className="custom-h2 fw-bold"
                    style={{ textAlign: "center" }}
                  >
                    ตำแหน่งบุคลากร
                  </div>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70} // ทำให้เป็น donut
                        label
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Col>
            <Col md={6} className="graph-box">
              <Row>
                <Col md={12} className="d-flex gap-2">
                  <div
                    className="custom-h2 fw-bold align-self-center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    ข้อมูลนักเรียนทั้งหมดประจำ
                  </div>
                  <select
                    className="modern-select"
                    style={{ width: "170px" }}
                    value={selectedStudentYear}
                    onChange={(e) => setSelectedStudentYear(e.target.value)}
                  >
                    {academicYears
                      .slice()
                      .sort((a, b) => Number(b.id) - Number(a.id))
                      .map((year) => (
                        <option key={year.id} value={year.id}>
                          ปีการศึกษา {year.id}
                        </option>
                      ))}
                  </select>
                </Col>
              </Row>
              <Row className="mt-3" style={{ height: 300 }}>
                <Col md={5}>
                  <ul className="mb-0">
                    {Object.entries(studentCounts).length ? (
                      Object.entries(studentCounts).map(([level, cnt]) => (
                        <li key={level}>
                          {level}: {cnt} คน
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">ไม่มีข้อมูลนักเรียน</li>
                    )}
                  </ul>
                </Col>
                <Col md={7} className="h-100">
                  <div
                    className="custom-h2 fw-bold"
                    style={{ textAlign: "center" }}
                  >
                    ชั้นเรียนของนักเรียน
                  </div>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={studentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={70} // ทำให้เป็น donut
                        label
                      >
                        {studentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ManagerHome;
