import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import { useTeacherTable } from "../context/TeacherTableContext";
import { Form, Alert, Button } from "react-bootstrap";
import { db } from "../firebase";
import { updateDoc, setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

function TimeTableManagement() {
  const [regMon1, setRegMon1] = useState("-");
  const [regMon2, setRegMon2] = useState("-");
  const [regMon3, setRegMon3] = useState("-");
  const [regMon4, setRegMon4] = useState("-");
  const [regMon5, setRegMon5] = useState("-");
  const [regMon6, setRegMon6] = useState("-");
  const [regTue1, setRegTue1] = useState("-");
  const [regTue2, setRegTue2] = useState("-");
  const [regTue3, setRegTue3] = useState("-");
  const [regTue4, setRegTue4] = useState("-");
  const [regTue5, setRegTue5] = useState("-");
  const [regTue6, setRegTue6] = useState("-");
  const [regWed1, setRegWed1] = useState("-");
  const [regWed2, setRegWed2] = useState("-");
  const [regWed3, setRegWed3] = useState("-");
  const [regWed4, setRegWed4] = useState("-");
  const [regWed5, setRegWed5] = useState("-");
  const [regWed6, setRegWed6] = useState("-");
  const [regThu1, setRegThu1] = useState("-");
  const [regThu2, setRegThu2] = useState("-");
  const [regThu3, setRegThu3] = useState("-");
  const [regThu4, setRegThu4] = useState("-");
  const [regThu5, setRegThu5] = useState("-");
  const [regThu6, setRegThu6] = useState("-");
  const [regFri1, setRegFri1] = useState("-");
  const [regFri2, setRegFri2] = useState("-");
  const [regFri3, setRegFri3] = useState("-");
  const [regFri4, setRegFri4] = useState("-");
  const [regFri5, setRegFri5] = useState("-");
  const [regFri6, setRegFri6] = useState("-");

  const [regTimeTable, setRegTimeTable] = useState([
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    { startHour: "", startMinute: "", endHour: "", endMinute: "" },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();

  const { firstName, lastName, logOut } = useUserAuth();

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

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const regTimeTableObj = {};
    regTimeTable.forEach((slot, index) => {
      regTimeTableObj[index + 1] = slot;
    });

    try {
      await setDoc(
        doc(db, "time_table", "GnIYgvi6eieBMulTF8eK"),
        regTimeTableObj
      );
      setIsEditing(false);
      console.log("Data saved to Firestore!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "time_table", "GnIYgvi6eieBMulTF8eK"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const newTimeTable = [1, 2, 3, 4, 5, 6].map(
            (n) =>
              data[n] || {
                startHour: "",
                startMinute: "",
                endHour: "",
                endMinute: "",
              }
          );
          setRegTimeTable(newTimeTable);
        }
      }
    );
    return () => unsubscribe();
  }, [isEditing]);

  return (
    <div style={{ backgroundColor: "#BBBBBB" }}>
      <Navbar />

      <div className="page-detail p-2">
        <div className="d-flex h-100">
          <div className="p-2" style={{ width: "40%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                จัดการตารางเวลา
              </div>
              <form
                onSubmit={handleSave}
                className="d-flex flex-column align-items-center p-3 gap-3 h-100 shadow rounded bg-white"
              >
                <div className="d-flex align-items-start w-100 h-100 border rounded border-secondary">
                  <div
                    className="w-100 border rounded"
                    style={{ height: "615px" }}
                  >
                    <div
                      className="fs-5 fw-bold text-center border-bottom rounded-top"
                      style={{
                        backgroundColor: "#FFD786",
                        height: "50px",
                        lineHeight: "50px",
                      }}
                    >
                      เวลาเรียน / สอน
                    </div>

                    <div className="d-flex flex-column w-100" style={{ height: "565px" }}>
                      {isEditing
                        ? regTimeTable.map((time, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-center align-items-center gap-2 my-2"
                              style={{ flex: 1, backgroundColor: "#f8f9fa" }}
                            >
                              <div>คาบที่ {index + 1}</div>

                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="HH"
                                value={time.startHour}
                                onChange={(e) => {
                                  const updated = [...regTimeTable];
                                  updated[index].startHour = e.target.value;
                                  setRegTimeTable(updated);
                                }}
                              />
                              <div>:</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="MM"
                                value={time.startMinute}
                                onChange={(e) => {
                                  const updated = [...regTimeTable];
                                  updated[index].startMinute = e.target.value;
                                  setRegTimeTable(updated);
                                }}
                              />
                              <div>-</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="HH"
                                value={time.endHour}
                                onChange={(e) => {
                                  const updated = [...regTimeTable];
                                  updated[index].endHour = e.target.value;
                                  setRegTimeTable(updated);
                                }}
                              />
                              <div>:</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="MM"
                                value={time.endMinute}
                                onChange={(e) => {
                                  const updated = [...regTimeTable];
                                  updated[index].endMinute = e.target.value;
                                  setRegTimeTable(updated);
                                }}
                              />
                            </div>
                          ))
                        : regTimeTable.map((time, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-center align-items-center gap-2 my-2"
                              style={{ flex: 1, backgroundColor: "#f8f9fa" }}
                            >
                              <div>คาบที่ {index + 1}</div>

                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="HH"
                                value={time.startHour}
                                disabled
                              />
                              <div>:</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="MM"
                                value={time.startMinute}
                                disabled
                              />
                              <div>-</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="HH"
                                value={time.endHour}
                                disabled
                              />
                              <div>:</div>
                              <input
                                type="number"
                                className="form-control text-center"
                                style={{ width: "70px" }}
                                placeholder="MM"
                                value={time.endMinute}
                                disabled
                              />
                            </div>
                          ))}
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="edit-butt px-4 rounded-pill shadow-sm"
                    >
                      บันทึก
                    </button>
                    <button
                      type="button"
                      className="delete-butt px-4 rounded-pill"
                      onClick={() => setIsEditing(false)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="delete-butt px-5 rounded-pill shadow-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    แก้ไข
                  </button>
                )}
              </form>
            </div>
          </div>
          <div className="p-2" style={{ width: "60%" }}>
            <div className="d-flex flex-column w-100 h-100 gap-1">
              <div className="custom-h2 d-flex justify-content-center fw-bold">
                ตัวอย่าง
              </div>
              <div className="d-flex w-100 h-50 timetable-box">
                {/* ฝั่งซ้าย */}
                <div className="h-100 d-flex" style={{ width: "49.5%" }}>
                  {/* แถวชื่อวัน */}
                  <div
                    className="h-100 border-end border-black"
                    style={{ width: "25%" }}
                  >
                    <div
                      className="border-bottom border-black time-header"
                      style={{ height: "10%" }}
                    ></div>
                    <div
                      className="d-flex flex-column"
                      style={{ height: "90%" }}
                    >
                      {["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"].map(
                        (day, i) => (
                          <div
                            key={i}
                            className="timetable-cell day-header"
                            style={{ height: "20%" }}
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* คาบเช้า */}
                  {[
                    {
                      time: `${regTimeTable[0].startHour}:${regTimeTable[0].startMinute} - ${regTimeTable[0].endHour}:${regTimeTable[0].endMinute}`,
                      data: [regMon1, regTue1, regWed1, regThu1, regFri1],
                    },
                    {
                      time: `${regTimeTable[1].startHour}:${regTimeTable[1].startMinute} - ${regTimeTable[1].endHour}:${regTimeTable[1].endMinute}`,
                      data: [regMon2, regTue2, regWed2, regThu2, regFri2],
                    },
                    {
                      time: `${regTimeTable[2].startHour}:${regTimeTable[2].startMinute} - ${regTimeTable[2].endHour}:${regTimeTable[2].endMinute}`,
                      data: [regMon3, regTue3, regWed3, regThu3, regFri3],
                    },
                  ].map((col, i) => (
                    <div
                      key={i}
                      className="h-100 border-end border-black"
                      style={{ width: "25%" }}
                    >
                      <div
                        className="timetable-cell time-header"
                        style={{ height: "10%" }}
                      >
                        {col.time}
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{ height: "90%" }}
                      >
                        {col.data.map((item, j) => (
                          <div
                            key={j}
                            className="timetable-cell"
                            style={{ height: "20%" }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* กลาง = พัก */}
                <div
                  className="d-flex justify-content-center align-items-center h-100 border-start border-end border-black"
                  style={{ width: "5%" }}
                >
                  <div
                    className="w-0 h-0"
                    style={{
                      transform: "rotate(-90deg)",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    พักกลางวัน
                  </div>
                </div>

                {/* ฝั่งขวา */}
                <div className="h-100 d-flex" style={{ width: "49.5%" }}>
                  {/* คาบบ่าย */}
                  {[
                    {
                      time: `${regTimeTable[3].startHour}:${regTimeTable[3].startMinute} - ${regTimeTable[3].endHour}:${regTimeTable[3].endMinute}`,
                      data: [regMon4, regTue4, regWed4, regThu4, regFri4],
                    },
                    {
                      time: `${regTimeTable[4].startHour}:${regTimeTable[4].startMinute} - ${regTimeTable[4].endHour}:${regTimeTable[4].endMinute}`,
                      data: [regMon5, regTue5, regWed5, regThu5, regFri5],
                    },
                    {
                      time: `${regTimeTable[5].startHour}:${regTimeTable[5].startMinute} - ${regTimeTable[5].endHour}:${regTimeTable[5].endMinute}`,
                      data: [regMon6, regTue6, regWed6, regThu6, regFri6],
                    },
                    { time: "", data: ["", "", "", "", ""] },
                  ].map((col, i) => (
                    <div
                      key={i}
                      className="h-100 border-end border-black"
                      style={{ width: "25%" }}
                    >
                      <div
                        className="timetable-cell time-header"
                        style={{ height: "10%" }}
                      >
                        {col.time}
                      </div>
                      <div
                        className="d-flex flex-column"
                        style={{ height: "90%" }}
                      >
                        {col.data.map((item, j) => (
                          <div
                            key={j}
                            className="timetable-cell"
                            style={{ height: "20%" }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TimeTableManagement;
