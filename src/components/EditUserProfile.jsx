import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import { useLocation, useNavigate, Link } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import { useUserProfile } from "../context/ProfileDataContex";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  runTransaction,
  deleteField,
  query,
  orderBy,
} from "firebase/firestore";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./EditUserProfile.css"; // เพิ่ม CSS สำหรับ modal review

function EditUserProfile() {
  //
  const [profileID, setProfileID] = useState("");
  //
  const [teacherID, setTeacherID] = useState("");
  const [studentID, setStudentID] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPosition, setRegPosition] = useState("");
  const [regClassLevel, setRegClassLevel] = useState("");
  const [regTaughtSubjects, setRegTaughtSubjects] = useState([""]);
  const [regAge, setRegAge] = useState(0);
  const [gender, setGender] = useState("");
  const [regIDCard, setRegIDCard] = useState(0);
  const [regBornAt, setRegBornAt] = useState("");
  const [regBirthday, setRegBirthday] = useState("");
  const [regReligion, setRegReligion] = useState("");
  const [regEthnicity, setRegEthnicity] = useState("");
  const [regBirthOrder, setRegBirthOrder] = useState(0);
  const [regNationality, setRegNationality] = useState("");
  const [regSiblingsCount, setRegSiblingsCount] = useState(0);
  //
  const [regHouseNum, setRegHouseNum] = useState("");
  const [regVillageNum, setRegVillageNum] = useState("");
  const [regVillageName, setRegVillageName] = useState("");
  const [regRoad, setRegRoad] = useState("");
  const [regSubDistrict, setRegSubDistrict] = useState("");
  const [regDistrict, setRegDistrict] = useState("");
  const [regProvince, setRegProvince] = useState("");
  const [regZipcode, setRegZipcode] = useState("");
  const [regTeleNum, setRegTeleNum] = useState("");
  //
  const [regFatherName, setRegFatherName] = useState("");
  const [regOccupation1, setRegOccupation1] = useState("");
  const [regMonthlyIncome1, setRegMonthlyIncome1] = useState("");
  const [regHouseNum1, setRegHouseNum1] = useState("");
  const [regVillageNum1, setRegVillageNum1] = useState("");
  const [regRoad1, setRegRoad1] = useState("");
  const [regSubDistrict1, setRegSubDistrict1] = useState("");
  const [regDistrict1, setRegDistrict1] = useState("");
  const [regProvince1, setRegProvince1] = useState("");
  const [regZipcode1, setRegZipcode1] = useState("");
  const [regFatherNum, setRegFatherNum] = useState("");
  //
  const [regMotherName, setRegMotherName] = useState("");
  const [regOccupation2, setRegOccupation2] = useState("");
  const [regMonthlyIncome2, setRegMonthlyIncome2] = useState("");
  const [regHouseNum2, setRegHouseNum2] = useState("");
  const [regVillageNum2, setRegVillageNum2] = useState("");
  const [regRoad2, setRegRoad2] = useState("");
  const [regSubDistrict2, setRegSubDistrict2] = useState("");
  const [regDistrict2, setRegDistrict2] = useState("");
  const [regProvince2, setRegProvince2] = useState("");
  const [regZipcode2, setRegZipcode2] = useState("");
  const [regMotherNum, setRegMotherNum] = useState("");
  //
  const [regParentName, setRegParentName] = useState("");
  const [regOccupation3, setRegOccupation3] = useState("");
  const [regMonthlyIncome3, setRegMonthlyIncome3] = useState("");
  const [regHouseNum3, setRegHouseNum3] = useState("");
  const [regVillageNum3, setRegVillageNum3] = useState("");
  const [regRoad3, setRegRoad3] = useState("");
  const [regSubDistrict3, setRegSubDistrict3] = useState("");
  const [regDistrict3, setRegDistrict3] = useState("");
  const [regProvince3, setRegProvince3] = useState("");
  const [regZipcode3, setRegZipcode3] = useState("");
  const [regParentNum, setRegParentNum] = useState("");
  //
  const [subjects, setSubjects] = useState([]);
  const [vacantSubjects, setVacantSubjects] = useState([]);
  const [prevTaughtSubject, setPrevTaughtSubject] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);

  // --- State สำหรับแต่ละกลุ่ม ---
  const [provinces1, setProvinces1] = useState([]);
  const [amphures1, setAmphures1] = useState([]);
  const [districts1, setDistricts1] = useState([]);

  const [provinces2, setProvinces2] = useState([]);
  const [amphures2, setAmphures2] = useState([]);
  const [districts2, setDistricts2] = useState([]);

  const [provinces3, setProvinces3] = useState([]);
  const [amphures3, setAmphures3] = useState([]);
  const [districts3, setDistricts3] = useState([]);

  const [regBirthProvinceID, setBirthProvinceID] = useState("");
  const [regBirthDistrictID, setBirthDistrictID] = useState("");
  const [regBirthSubDistrictID, setBirthSubDistrictID] = useState("");

  const [regBirthProvince, setBirthProvince] = useState("");
  const [regBirthDistrict, setBirthDistrict] = useState("");
  const [regBirthSubDistrict, setBirthSubDistrict] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData1, setFormData1] = useState({});
  const [formData2, setFormData2] = useState({});

  const [error, setError] = useState("");

  const { logOut, user, firstName, lastName } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);

  let menuRef1 = useRef(null);
  let menuRef2 = useRef(null);
  let menuRef3 = useRef(null);
  let menuRef4 = useRef(null);
  let menuRef5 = useRef(null);
  let menuRef6 = useRef(null);

  // --------- Small helper: cached fetch for JSON used by many effects ----------
  const jsonCache = useRef({});
  const fetchJSON = async (url) => {
    if (jsonCache.current[url]) return jsonCache.current[url];
    const res = await fetch(url).then((r) => r.json());
    jsonCache.current[url] = res;
    return res;
  };

  // Reuse urls
  const PROVINCE_URL =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json";
  const AMPHURE_URL =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json";
  const TAMBON_URL =
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) setProfileID(id);
  }, [location.search]);

  // ค้นหาข้อมูลโปรไฟล์
  useEffect(() => {
    if (!profileID) return;

    const unsubscribe = onSnapshot(
      doc(db, "profile", profileID),
      (snapshot) => {
        const newData = snapshot.data();
        if (!newData) return; // ✅ ป้องกัน error

        setTeacherID(newData.user?.teacherID || "");
        setStudentID(newData.user?.studentID || "");
        setRegFirstName(newData.user?.firstName || "");
        setRegLastName(newData.user?.lastName || "");
        setRegPosition(newData.user?.position || "");
        setRegClassLevel(newData.user?.classLevel || "");
        setRegReligion(newData.user?.religion || "");
        setRegEthnicity(newData.user?.ethnicity || "");
        setRegNationality(newData.user?.nationality || "");
        setRegBirthday(newData.user?.birthDate || "");
        setRegAge(newData.user?.age || 0);
        setGender(newData.user?.gender || "");
        setRegBornAt(newData.user?.bornAt || "");
        setRegTeleNum(newData.address?.user?.teleNum || "");
        setRegIDCard(newData.user?.IDCard || 0);
        setRegBirthOrder(newData.user?.birthOrder || 0);
        setRegSiblingsCount(newData.user?.siblingsCount || 0);

        setRegFatherName(newData.father?.fullName || "");
        setRegOccupation1(newData.father?.occupation || "");
        setRegMonthlyIncome1(newData.father?.monthlyIncome || "");
        setRegFatherNum(newData.address?.father?.fatherNum || "");

        setRegMotherName(newData.mother?.fullName || "");
        setRegOccupation2(newData.mother?.occupation || "");
        setRegMonthlyIncome2(newData.mother?.monthlyIncome || "");
        setRegMotherNum(newData.address?.mother?.motherNum || "");

        setRegParentName(newData.parent?.fullName || "");
        setRegOccupation3(newData.parent?.occupation || "");
        setRegMonthlyIncome3(newData.parent?.monthlyIncome || "");
        setRegParentNum(newData.address?.parent?.parentNum || "");

        // รองรับ array หรือ string
        if (Array.isArray(newData.user?.taughtSubject)) {
          setRegTaughtSubjects(newData.user.taughtSubject);
          setPrevTaughtSubject(newData.user.taughtSubject);
        } else {
          setRegTaughtSubjects([newData.user?.taughtSubject || ""]);
          setPrevTaughtSubject([newData.user?.taughtSubject || ""]);
        }
      }
    );

    return () => unsubscribe();
  }, [profileID]);

  // ค้นหาข้อมูลที่อยู่
  useEffect(() => {
    if (!profileID) return;

    const unsubscribe = onSnapshot(
      doc(db, "address", profileID),
      (snapshot) => {
        const newData = snapshot.data();
        if (!newData) return; // ✅ ป้องกัน error

        // ที่อยู่ปัจจุบัน (user)
        setRegVillageName(newData.user?.villageName || "");
        setRegHouseNum(newData.user?.houseNum || "");
        setRegVillageNum(newData.user?.villageNum || "");
        setRegRoad(newData.user?.road || "");
        setRegSubDistrict(newData.user?.subDistrict || "");
        setRegDistrict(newData.user?.district || "");
        setRegProvince(newData.user?.province || "");
        setRegZipcode(newData.user?.zipcode || "");
        setRegTeleNum(newData.user?.teleNum || "");

        // ที่อยู่บิดา (father)
        setRegHouseNum1(newData.father?.houseNum || "");
        setRegVillageNum1(newData.father?.villageNum || "");
        setRegRoad1(newData.father?.road || "");
        setRegSubDistrict1(newData.father?.subDistrict || "");
        setRegDistrict1(newData.father?.district || "");
        setRegProvince1(newData.father?.province || "");
        setRegZipcode1(newData.father?.zipcode || "");
        setRegFatherNum(newData.father?.fatherNum || "");

        // ที่อยู่มารดา (mother)
        setRegHouseNum2(newData.mother?.houseNum || "");
        setRegVillageNum2(newData.mother?.villageNum || "");
        setRegRoad2(newData.mother?.road || "");
        setRegSubDistrict2(newData.mother?.subDistrict || "");
        setRegDistrict2(newData.mother?.district || "");
        setRegProvince2(newData.mother?.province || "");
        setRegZipcode2(newData.mother?.zipcode || "");
        setRegMotherNum(newData.mother?.motherNum || "");

        // ที่อยู่ผู้ปกครอง (parent)
        setRegHouseNum3(newData.parent?.houseNum || "");
        setRegVillageNum3(newData.parent?.villageNum || "");
        setRegRoad3(newData.parent?.road || "");
        setRegSubDistrict3(newData.parent?.subDistrict || "");
        setRegDistrict3(newData.parent?.district || "");
        setRegProvince3(newData.parent?.province || "");
        setRegZipcode3(newData.parent?.zipcode || "");
        setRegParentNum(newData.parent?.parentNum || "");
      }
    );

    return () => unsubscribe();
  }, [profileID]);

  // ดึงข้อมูลวิชา
  useEffect(() => {
    const q = query(collection(db, "subjects"), orderBy("classLevel", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSubjects(rows);
    });

    return () => unsubscribe();
  }, []);

  // วิชาว่าง
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const vacant = rows.filter(
        (s) =>
          !Object.prototype.hasOwnProperty.call(s, "teacherId") ||
          s.teacherId == null
      );
      setVacantSubjects(vacant);
    });
    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------------- //
  // Consolidated/faster fetches with caching to reduce repeated network calls
  useEffect(() => {
    let mounted = true;
    fetchJSON(PROVINCE_URL)
      .then((data) => {
        if (!mounted) return;
        // set all province states once (keeps behavior)
        setProvinces(data);
        setProvinces1(data);
        setProvinces2(data);
        setProvinces3(data);
      })
      .catch((err) => console.log("province load error", err));
    return () => {
      mounted = false;
    };
  }, []);

  // amphures for current user address
  useEffect(() => {
    if (!regProvince) {
      setAmphures([]);
      return;
    }
    let mounted = true;
    fetchJSON(AMPHURE_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince)
        );
        setAmphures(filtered);
      })
      .catch((err) => console.log("amphure load error", err));
    return () => (mounted = false);
  }, [regProvince]);

  // districts for current user address
  useEffect(() => {
    if (!regDistrict) {
      setDistricts([]);
      return;
    }
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict)
        );
        setDistricts(filtered);
      })
      .catch((err) => console.log("tambon load error", err));
    return () => (mounted = false);
  }, [regDistrict]);

  useEffect(() => {
    if (!regSubDistrict) return;
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict)
        );
        if (selectedSubDistrict) {
          setRegZipcode(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      })
      .catch((err) => console.log("tambon zipcode error", err));
    return () => (mounted = false);
  }, [regSubDistrict]);

  // ที่อยู่เกิด ---------------------------------------------------- //
  useEffect(() => {
    if (!regBirthProvinceID) {
      setAmphures1([]);
      return;
    }
    let mounted = true;
    fetchJSON(AMPHURE_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regBirthProvinceID)
        );
        setAmphures1(filtered);
      })
      .catch((err) => console.log("birth amphure error", err));
    return () => (mounted = false);
  }, [regBirthProvinceID]);

  useEffect(() => {
    if (!regBirthDistrictID) {
      setDistricts1([]);
      return;
    }
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regBirthDistrictID)
        );
        setDistricts1(filtered);
      })
      .catch((err) => console.log("birth tambon error", err));
    return () => (mounted = false);
  }, [regBirthDistrictID]);

  useEffect(() => {
    const province = provinces1.find(
      (a) => a.id === parseInt(regBirthProvinceID)
    );
    if (province) {
      setBirthProvince("จังหวัด" + province.name_th);
    } else {
      setBirthProvince("");
    }

    const district = amphures1.find(
      (a) => a.id === parseInt(regBirthDistrictID)
    );
    if (district) {
      setBirthDistrict(district.name_th);
    } else {
      setBirthDistrict("");
    }

    const subdistrict = districts1.find(
      (d) => d.id === parseInt(regBirthSubDistrictID)
    );
    if (subdistrict) {
      setBirthSubDistrict(subdistrict.name_th);
    } else {
      setBirthSubDistrict("");
    }
  }, [
    regBirthProvinceID,
    regBirthDistrictID,
    regBirthSubDistrictID,
    provinces1,
    amphures1,
    districts1,
  ]);

  useEffect(() => {
    setRegBornAt(
      regBirthSubDistrict + " " + regBirthDistrict + " " + regBirthProvince
    );
  }, [regBirthSubDistrict, regBirthDistrict, regBirthProvince]);
  // ---------------------------------------------------------------- //

  // --- useEffect สำหรับบิดา ---
  useEffect(() => {
    if (!regProvince1) {
      setAmphures1((prev) => prev); // keep existing if any
      return;
    }
    let mounted = true;
    fetchJSON(AMPHURE_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince1)
        );
        setAmphures1(filtered);
      })
      .catch((err) => console.log("father amphure error", err));
    return () => (mounted = false);
  }, [regProvince1]);

  useEffect(() => {
    if (!regDistrict1) {
      setDistricts1([]);
      return;
    }
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict1)
        );
        setDistricts1(filtered);
      })
      .catch((err) => console.log("father tambon error", err));
    return () => (mounted = false);
  }, [regDistrict1]);

  useEffect(() => {
    if (
      !regSubDistrict1 ||
      !provinces1.length ||
      !amphures1.length ||
      !districts1.length
    )
      return;
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict1)
        );
        if (selectedSubDistrict) {
          setRegZipcode1(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      })
      .catch((err) => console.log("father zipcode error", err));
    return () => (mounted = false);
  }, [regSubDistrict1, provinces1, amphures1, districts1]);

  // --- useEffect สำหรับมารดา ---
  useEffect(() => {
    if (!regProvince2) {
      setAmphures2([]);
      return;
    }
    let mounted = true;
    fetchJSON(AMPHURE_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince2)
        );
        setAmphures2(filtered);
      })
      .catch((err) => console.log("mother amphure error", err));
    return () => (mounted = false);
  }, [regProvince2]);

  useEffect(() => {
    if (!regDistrict2) {
      setDistricts2([]);
      return;
    }
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict2)
        );
        setDistricts2(filtered);
      })
      .catch((err) => console.log("mother tambon error", err));
    return () => (mounted = false);
  }, [regDistrict2]);

  useEffect(() => {
    if (
      !regSubDistrict2 ||
      !provinces2.length ||
      !amphures2.length ||
      !districts2.length
    )
      return;
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict2)
        );
        if (selectedSubDistrict) {
          setRegZipcode2(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      })
      .catch((err) => console.log("mother zipcode error", err));
    return () => (mounted = false);
  }, [regSubDistrict2, provinces2, amphures2, districts2]);

  // --- useEffect สำหรับผู้ปกครอง ---
  useEffect(() => {
    if (!regProvince3) {
      setAmphures3([]);
      return;
    }
    let mounted = true;
    fetchJSON(AMPHURE_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince3)
        );
        setAmphures3(filtered);
      })
      .catch((err) => console.log("parent amphure error", err));
    return () => (mounted = false);
  }, [regProvince3]);

  useEffect(() => {
    if (!regDistrict3) {
      setDistricts3([]);
      return;
    }
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict3)
        );
        setDistricts3(filtered);
      })
      .catch((err) => console.log("parent tambon error", err));
    return () => (mounted = false);
  }, [regDistrict3]);

  useEffect(() => {
    if (
      !regSubDistrict3 ||
      !provinces3.length ||
      !amphures3.length ||
      !districts3.length
    )
      return;
    let mounted = true;
    fetchJSON(TAMBON_URL)
      .then((data) => {
        if (!mounted) return;
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict3)
        );
        if (selectedSubDistrict) {
          setRegZipcode3(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      })
      .catch((err) => console.log("parent zipcode error", err));
    return () => (mounted = false);
  }, [regSubDistrict3, provinces3, amphures3, districts3]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef1.current && !menuRef1.current.contains(e.target))
        setOpen1(false);
      if (menuRef2.current && !menuRef2.current.contains(e.target))
        setOpen2(false);
      if (menuRef3.current && !menuRef3.current.contains(e.target))
        setOpen3(false);
      if (menuRef4.current && !menuRef4.current.contains(e.target))
        setOpen4(false);
      if (menuRef5.current && !menuRef5.current.contains(e.target))
        setOpen5(false);
      if (menuRef6.current && !menuRef6.current.contains(e.target))
        setOpen6(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAgeCount = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    setRegAge(age);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // รีเซ็ตข้อผิดพลาด

    try {
      // ข้อมูลผู้ใช้
      const userProfile = {
        user: {
          firstName: regFirstName,
          lastName: regLastName,
          position: regPosition,
          birthDate: regBirthday,
          age: regAge,
          gender: gender,
          ethnicity: regEthnicity,
          nationality: regNationality,
          religion: regReligion,
          IDCard: regIDCard,
          ...(regPosition === "นักเรียน" && {
            classLevel: regClassLevel,
            bornAt: regBornAt,
          }),
        },
      };

      if (regPosition === "นักเรียน") {
        userProfile.user = {
          ...userProfile.user,
          birthOrder: regBirthOrder,
          siblingsCount: regSiblingsCount,
        };
        userProfile.father = {
          fullName: regFatherName,
          occupation: regOccupation1,
          monthlyIncome: regMonthlyIncome1,
        };
        userProfile.mother = {
          fullName: regMotherName,
          occupation: regOccupation2,
          monthlyIncome: regMonthlyIncome2,
        };
        userProfile.parent = {
          fullName: regParentName,
          occupation: regOccupation3,
          monthlyIncome: regMonthlyIncome3,
        };
      }

      // ข้อมูลที่อยู่ของผู้ใช้, พ่อ, แม่, และผู้ปกครอง
      const selectedProvince = provinces.find(
        (p) => p.id === parseInt(regProvince)
      );
      const selectedDistrict = amphures.find(
        (a) => a.id === parseInt(regDistrict)
      );
      const selectedSubDistrict = districts.find(
        (d) => d.id === parseInt(regSubDistrict)
      );

      const selectedProvince1 = provinces1.find(
        (p) => p.id === parseInt(regProvince1)
      );
      const selectedDistrict1 = amphures1.find(
        (a) => a.id === parseInt(regDistrict1)
      );
      const selectedSubDistrict1 = districts1.find(
        (d) => d.id === parseInt(regSubDistrict1)
      );

      const selectedProvince2 = provinces2.find(
        (p) => p.id === parseInt(regProvince2)
      );
      const selectedDistrict2 = amphures2.find(
        (a) => a.id === parseInt(regDistrict2)
      );
      const selectedSubDistrict2 = districts2.find(
        (d) => d.id === parseInt(regSubDistrict2)
      );

      const selectedProvince3 = provinces3.find(
        (p) => p.id === parseInt(regProvince3)
      );
      const selectedDistrict3 = amphures3.find(
        (a) => a.id === parseInt(regDistrict3)
      );
      const selectedSubDistrict3 = districts3.find(
        (d) => d.id === parseInt(regSubDistrict3)
      );

      const userAddress = {
        user: {
          houseNum: regHouseNum,
          villageNum: regVillageNum,
          villageName: regVillageName,
          road: regRoad,
          subDistrict: regSubDistrict, // id
          subDistrictName: selectedSubDistrict
            ? selectedSubDistrict.name_th
            : "",
          district: regDistrict, // id
          districtName: selectedDistrict ? selectedDistrict.name_th : "",
          province: regProvince, // id
          provinceName: selectedProvince ? selectedProvince.name_th : "",
          zipcode: regZipcode,
          teleNum: regTeleNum,
        },
      };

      if (regPosition === "นักเรียน") {
        userAddress.father = {
          houseNum: regHouseNum1,
          villageNum: regVillageNum1,
          road: regRoad1,
          subDistrict: regSubDistrict1, // id
          subDistrictName: selectedSubDistrict1
            ? selectedSubDistrict1.name_th
            : "",
          district: regDistrict1, // id
          districtName: selectedDistrict1 ? selectedDistrict1.name_th : "",
          province: regProvince1, // id
          provinceName: selectedProvince1 ? selectedProvince1.name_th : "",
          zipcode: regZipcode1,
          fatherNum: regFatherNum,
        };
        userAddress.mother = {
          houseNum: regHouseNum2,
          villageNum: regVillageNum2,
          road: regRoad2,
          subDistrict: regSubDistrict2, // id
          subDistrictName: selectedSubDistrict2
            ? selectedSubDistrict2.name_th
            : "",
          district: regDistrict2, // id
          districtName: selectedDistrict2 ? selectedDistrict2.name_th : "",
          province: regProvince2, // id
          provinceName: selectedProvince2 ? selectedProvince2.name_th : "",
          zipcode: regZipcode2,
          motherNum: regMotherNum,
        };
        userAddress.parent = {
          houseNum: regHouseNum3,
          villageNum: regVillageNum3,
          road: regRoad3,
          subDistrict: regSubDistrict3, // id
          subDistrictName: selectedSubDistrict3
            ? selectedSubDistrict3.name_th
            : "",
          district: regDistrict3, // id
          districtName: selectedDistrict3 ? selectedDistrict3.name_th : "",
          province: regProvince3, // id
          provinceName: selectedProvince3 ? selectedProvince3.name_th : "",
          zipcode: regZipcode3,
          parentNum: regParentNum,
        };
      }

      setFormData1(userProfile);
      setFormData2(userAddress);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleConfirmSave = async () => {
    try {
      // ซิงก์ครู↔วิชา เฉพาะถ้าบุคคลนี้เป็น "ครู"
      if (regPosition === "ครู") {
        // ครู 1 คนสอนได้หลายวิชา แต่ 1 วิชามีครูได้แค่คนเดียว
        const prev = new Set((prevTaughtSubject ?? []).filter(Boolean));
        const next = new Set((regTaughtSubjects ?? []).filter(Boolean));

        const toRemove = [...prev].filter((id) => !next.has(id));
        const toAdd = [...next].filter((id) => !prev.has(id));

        // เอาครูออกจากวิชาที่เลิกสอน (เฉพาะถ้าวิชานั้นผูกกับครูคนนี้จริง)
        await Promise.all(
          toRemove.map(async (subjId) => {
            const ref = doc(db, "subjects", subjId);
            await runTransaction(db, async (tx) => {
              const snap = await tx.get(ref);
              if (!snap.exists()) return;
              if (snap.data().teacherId === profileID) {
                tx.update(ref, { teacherId: deleteField() });
              }
            });
          })
        );

        // ผูกครูเข้าวิชาใหม่ (ถ้าวิชายังว่างหรือเป็นคนเดิม)
        const conflicts = [];
        await Promise.all(
          toAdd.map(async (subjId) => {
            const ref = doc(db, "subjects", subjId);
            await runTransaction(db, async (tx) => {
              const snap = await tx.get(ref);
              if (!snap.exists()) {
                // ยังไม่มีเอกสารวิชา → สร้างและผูกครู
                tx.set(ref, { teacherId: profileID }, { merge: true });
                return;
              }
              const cur = snap.data().teacherId;
              if (!cur || cur === profileID) {
                tx.update(ref, { teacherId: profileID });
              } else {
                // มีครูคนอื่นอยู่แล้ว → เก็บไว้แจ้งเตือน
                conflicts.push({ subjId, currentTeacherId: cur });
              }
            });
          })
        );

        // อัปเดตรายการวิชาที่สอนในโปรไฟล์ (สำหรับ UI)
        await setDoc(
          doc(db, "profile", profileID),
          { user: { taughtSubject: [...next] } },
          { merge: true }
        );

        if (conflicts.length) {
          setError(
            `วิชาต่อไปนี้มีครูคนอื่นอยู่แล้ว: ${conflicts
              .map((c) => c.subjId)
              .join(", ")}`
          );
        }

        // เก็บสถานะล่าสุดไว้เทียบรอบหน้า
        setPrevTaughtSubject([...next]);
      }

      // บันทึกข้อมูลโปรไฟล์/ที่อยู่ตามเดิม
      await setDoc(doc(db, "profile", profileID), formData1, { merge: true });
      await setDoc(doc(db, "address", profileID), formData2, { merge: true });

      console.log("Data saved successfully!");
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // --- helper: render nested review data for modal ---
  const renderValue = (val) => {
    if (val == null || val === "") return <em className="text-muted">-</em>;
    if (Array.isArray(val))
      return val.length ? val.join(", ") : <em className="text-muted">-</em>;
    if (typeof val === "object") return renderObject(val);
    return String(val);
  };

  const renderObject = (obj) =>
    Object.keys(obj || {}).map((key) => {
      const value = obj[key];
      // skip empty nested objects
      if (
        value == null ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      ) {
        return null;
      }
      return (
        <p key={key} style={{ marginBottom: 4 }}>
          <strong style={{ textTransform: "capitalize" }}>
            {key.replace(/([A-Z])/g, " $1")}:{" "}
          </strong>
          {renderValue(value)}
        </p>
      );
    });

  // ใหม่: สร้าง list-style review เพื่อใช้ใน modal (UI สวยงามขึ้น)
  const renderKeyValueList = (obj) => {
    if (!obj || Object.keys(obj).length === 0)
      return <em className="text-muted">-</em>;
    return (
      <ul className="list-group review-list">
        {Object.keys(obj).map((k) => {
          const v = obj[k];
          return (
            <li
              key={k}
              className="list-group-item d-flex align-items-start"
            >
              <Row className="w-100">
                <Col xs={4} className="review-key">
                  {k.replace(/([A-Z])/g, " $1")}
                </Col>
                <Col xs={8} className="review-value">
                  {renderValue(v)}
                </Col>
              </Row>
            </li>
          );
        })}
      </ul>
    );
  };

  const options = useMemo(
    () => subjects.map((s) => ({ value: s.id, ...s })),
    [subjects]
  );

  const vacantIdSet = useMemo(
    () => new Set((vacantSubjects ?? []).map((s) => s.id)),
    [vacantSubjects]
  );

  return (
    <div>
      <Navbar />

      <Form onSubmit={handleSubmit} className="bg-light p-5 rounded-4 shadow">
        <h2 className="text-center fw-bold mb-4">แก้ไขข้อมูลผู้ใช้</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ข้อมูลส่วนตัว */}
        <section>
          <h4 className="fw-bold">ข้อมูลส่วนตัว</h4>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>ชื่อ</Form.Label>
              <Form.Control
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Label>สกุล</Form.Label>
              <Form.Control
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>ตำแหน่ง</Form.Label>
              <Form.Control
                value={regPosition}
                onChange={(e) => setRegPosition(e.target.value)}
                // disabled
              />
            </Col>
            <Col md={6}>
              {regPosition === "ครู" && (
                <>
                  <Form.Label>วิชาที่สอน</Form.Label>
                  {regTaughtSubjects.map((subjectId, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-2">
                      <Select
                        value={
                          options.find((o) => o.value === subjectId) ?? null
                        }
                        onChange={(opt) => {
                          const newArr = [...regTaughtSubjects];
                          newArr[idx] = opt?.value ?? "";
                          setRegTaughtSubjects(newArr);
                        }}
                        options={options}
                        getOptionValue={(o) => o.value}
                        formatOptionLabel={(o) => (
                          <div
                            style={{
                              gap: 8,
                              display: "grid",
                              textAlign: "center",
                              gridTemplateColumns: "1fr 3fr 1fr",
                            }}
                          >
                            <span className="text-truncate">{o.id}</span>
                            <span className="text-truncate">{o.name}</span>
                            <span className="text-truncate">
                              {o.classLevel}
                            </span>
                          </div>
                        )}
                        styles={{
                          control: (base) => ({ ...base, width: "100%" }),
                        }}
                        // ถ้ายังโหลดไม่เสร็จ (vacantSubjects === null) จะไม่ disable อะไรชั่วคราว
                        isOptionDisabled={(o) => {
                          if (!vacantSubjects) return false;
                          const isVacant = vacantIdSet.has(o.value);
                          const isSelected = o.value === subjectId; // ปล่อย option ที่เลือกอยู่ให้คลิกดูได้
                          return !isVacant && !isSelected;
                        }}
                        isLoading={!vacantSubjects}
                      />

                      {regTaughtSubjects.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            setRegTaughtSubjects(
                              regTaughtSubjects.filter((_, i) => i !== idx)
                            );
                          }}
                        >
                          ลบ
                        </Button>
                      )}
                    </div>
                  ))}
                  <hr />
                  <Button
                    size="sm"
                    className="edit-butt"
                    onClick={() =>
                      setRegTaughtSubjects([...regTaughtSubjects, ""])
                    }
                  >
                    เพิ่มวิชาที่สอน
                  </Button>
                </>
              )}
              {regPosition === "นักเรียน" && (
                <>
                  <Form.Label>ระดับชั้น</Form.Label>
                  <Form.Control
                    value={regClassLevel}
                    onChange={(e) => setRegClassLevel(e.target.value)}
                    disabled
                  />
                </>
              )}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>วันเกิด</Form.Label>
              <Form.Control
                type="date"
                value={regBirthday}
                onChange={(e) => {
                  setRegBirthday(e.target.value);
                  handleAgeCount(e.target.value);
                }}
              />
            </Col>
            <Col md={3}>
              <Form.Label>อายุ</Form.Label>
              <Form.Control value={regAge} disabled />
            </Col>
            {regPosition === "นักเรียน" ? (
              <>
                <Col md={3} className="position-relative">
                  <Form.Label>เพศ</Form.Label>
                  <Form.Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">-- เลือกเพศ --</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="position-relative">
                  <Form.Label>เกิดที่</Form.Label>
                  <Form.Control
                    value={regBornAt}
                    onClick={() => setOpen4(!open4)}
                    readOnly
                  />
                  <div
                    ref={menuRef4}
                    className={`birth-address-1 ${
                      open4 ? "active" : "inactive"
                    }`}
                  >
                    {provinces1.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        onClick={(e) => {
                          setOpen5(!open5), setBirthProvinceID(e.target.value);
                        }}
                      >
                        {p.name_th}
                      </option>
                    ))}
                  </div>
                  <div
                    ref={menuRef5}
                    className={`birth-address-2 ${
                      open5 ? "active" : "inactive"
                    }`}
                  >
                    {amphures1.map((a) => (
                      <option
                        key={a.id}
                        value={a.id}
                        onClick={(e) => {
                          setOpen6(!open6), setBirthDistrictID(e.target.value);
                        }}
                      >
                        {a.name_th}
                      </option>
                    ))}
                  </div>
                  <div
                    ref={menuRef6}
                    className={`birth-address-3 ${
                      open6 ? "active" : "inactive"
                    }`}
                  >
                    {districts1.map((d) => (
                      <option
                        key={d.id}
                        value={d.id}
                        onClick={(e) => {
                          setOpen6(!open6),
                            setBirthSubDistrictID(e.target.value);
                        }}
                      >
                        {d.name_th}
                      </option>
                    ))}
                  </div>
                </Col>
              </>
            ) : (
              <>
                <Col md={3}>
                  <Form.Label>เชื้อชาติ</Form.Label>
                  <Form.Control
                    value={regEthnicity}
                    onChange={(e) => setRegEthnicity(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>สัญชาติ</Form.Label>
                  <Form.Control
                    value={regNationality}
                    onChange={(e) => setRegNationality(e.target.value)}
                  />
                </Col>{" "}
              </>
            )}
          </Row>

          <Row className="mb-3">
            {regPosition === "นักเรียน" && (
              <>
                <Col md={3}>
                  <Form.Label>เชื้อชาติ</Form.Label>
                  <Form.Control
                    value={regEthnicity}
                    onChange={(e) => setRegEthnicity(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label>สัญชาติ</Form.Label>
                  <Form.Control
                    value={regNationality}
                    onChange={(e) => setRegNationality(e.target.value)}
                  />
                </Col>
              </>
            )}
            <Col md={3}>
              <Form.Label>ศาสนา</Form.Label>
              <Form.Control
                value={regReligion}
                onChange={(e) => setRegReligion(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>เลขบัตรประจำตัวประชาชน</Form.Label>
              <Form.Control
                value={regIDCard}
                onChange={(e) => setRegIDCard(e.target.value)}
                type="number"
              />
            </Col>
          </Row>

          {regPosition === "นักเรียน" && (
            <Row className="mb-3">
              <Col md={3}>
                <Form.Label>เป็นบุตรคนที่</Form.Label>
                <Form.Control
                  value={regBirthOrder}
                  onChange={(e) => setRegBirthOrder(e.target.value)}
                  type="number"
                />
              </Col>
              <Col md={3}>
                <Form.Label>มีพี่น้อง</Form.Label>
                <Form.Control
                  value={regSiblingsCount}
                  onChange={(e) => setRegSiblingsCount(e.target.value)}
                  type="number"
                />
              </Col>
            </Row>
          )}
        </section>

        {/* ที่อยู่ */}
        <section>
          <h4 className="fw-bold mt-4">ที่อยู่ปัจจุบัน</h4>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>บ้านเลขที่</Form.Label>
              <Form.Control
                value={regHouseNum}
                onChange={(e) => setRegHouseNum(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>หมู่ที่</Form.Label>
              <Form.Control
                value={regVillageNum}
                onChange={(e) => setRegVillageNum(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>ชื่อหมู่บ้าน</Form.Label>
              <Form.Control
                value={regVillageName}
                onChange={(e) => setRegVillageName(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>ถนน/ตรอก/ซอย</Form.Label>
              <Form.Control
                value={regRoad}
                onChange={(e) => setRegRoad(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>ตำบล/แขวง</Form.Label>
              <Form.Select
                value={regSubDistrict}
                onChange={(e) => setRegSubDistrict(e.target.value)}
                disabled={!regDistrict}
              >
                <option value="">-- เลือกตำบล --</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_th}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>อำเภอ/เขต</Form.Label>
              <Form.Select
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                disabled={!regProvince}
              >
                <option value="">-- เลือกอำเภอ --</option>
                {amphures.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name_th}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>จังหวัด</Form.Label>
              <Form.Select
                value={regProvince}
                onChange={(e) => setRegProvince(e.target.value)}
              >
                <option value="">-- เลือกจังหวัด --</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name_th}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>รหัสไปรษณีย์</Form.Label>
              <Form.Control
                value={regZipcode}
                onChange={(e) => setRegZipcode(e.target.value)}
                disabled
              />
            </Col>
            <Col md={4}>
              <Form.Label>เบอร์โทร</Form.Label>
              <Form.Control
                type="tele"
                value={regTeleNum}
                onChange={(e) => setRegTeleNum(e.target.value)}
              />
            </Col>
          </Row>
        </section>

        {/* ข้อมูลครอบครัว */}
        {regPosition === "นักเรียน" && (
          <section>
            <h4 className="fw-bold mt-4">ข้อมูลครอบครัว</h4>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">ชื่อบิดา</Form.Label>
                <Form.Control
                  value={regFatherName}
                  onChange={(e) => setRegFatherName(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>อาชีพ</Form.Label>
                <Form.Control
                  value={regOccupation1}
                  onChange={(e) => setRegOccupation1(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>รายได้ / เดือน</Form.Label>
                <Form.Control
                  value={regMonthlyIncome1}
                  onChange={(e) => setRegMonthlyIncome1(e.target.value)}
                  type="number"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>บ้านเลขที่</Form.Label>
                <Form.Control
                  value={regHouseNum1}
                  onChange={(e) => setRegHouseNum1(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>หมู่ที่</Form.Label>
                <Form.Control
                  value={regVillageNum1}
                  onChange={(e) => setRegVillageNum1(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>ถนน/ตรอก/ซอย</Form.Label>
                <Form.Control
                  value={regRoad1}
                  onChange={(e) => setRegRoad1(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>ตำบล/แขวง</Form.Label>
                <Form.Select
                  value={regSubDistrict1}
                  onChange={(e) => setRegSubDistrict1(e.target.value)}
                  disabled={!regDistrict1}
                >
                  <option value="">-- เลือกตำบล --</option>
                  {districts1.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>อำเภอ/เขต</Form.Label>
                <Form.Select
                  value={regDistrict1}
                  onChange={(e) => setRegDistrict1(e.target.value)}
                  disabled={!regProvince1}
                >
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphures1.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>จังหวัด</Form.Label>
                <Form.Select
                  value={regProvince1}
                  onChange={(e) => setRegProvince1(e.target.value)}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces1.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-5">
              <Col md={4}>
                <Form.Label>รหัสไปรษณีย์</Form.Label>
                <Form.Control
                  value={regZipcode1}
                  onChange={(e) => setRegZipcode1(e.target.value)}
                  disabled
                />
              </Col>
              <Col md={4}>
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control
                  type="tele"
                  value={regFatherNum}
                  onChange={(e) => setRegFatherNum(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">ชื่อมารดา</Form.Label>
                <Form.Control
                  value={regMotherName}
                  onChange={(e) => setRegMotherName(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>อาชีพ</Form.Label>
                <Form.Control
                  value={regOccupation2}
                  onChange={(e) => setRegOccupation2(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>รายได้ / เดือน</Form.Label>
                <Form.Control
                  value={regMonthlyIncome2}
                  onChange={(e) => setRegMonthlyIncome2(e.target.value)}
                  type="number"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>บ้านเลขที่</Form.Label>
                <Form.Control
                  value={regHouseNum2}
                  onChange={(e) => setRegHouseNum2(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>หมู่ที่</Form.Label>
                <Form.Control
                  value={regVillageNum2}
                  onChange={(e) => setRegVillageNum2(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>ถนน/ตรอก/ซอย</Form.Label>
                <Form.Control
                  value={regRoad2}
                  onChange={(e) => setRegRoad2(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>ตำบล/แขวง</Form.Label>
                <Form.Select
                  value={regSubDistrict2}
                  onChange={(e) => setRegSubDistrict2(e.target.value)}
                  disabled={!regDistrict2}
                >
                  <option value="">-- เลือกตำบล --</option>
                  {districts2.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>อำเภอ/เขต</Form.Label>
                <Form.Select
                  value={regDistrict2}
                  onChange={(e) => setRegDistrict2(e.target.value)}
                  disabled={!regProvince2}
                >
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphures2.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>จังหวัด</Form.Label>
                <Form.Select
                  value={regProvince2}
                  onChange={(e) => setRegProvince2(e.target.value)}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces2.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-5">
              <Col md={4}>
                <Form.Label>รหัสไปรษณีย์</Form.Label>
                <Form.Control
                  value={regZipcode2}
                  onChange={(e) => setRegZipcode2(e.target.value)}
                  disabled
                />
              </Col>
              <Col md={4}>
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control
                  type="tele"
                  value={regMotherName}
                  onChange={(e) => setRegMotherNum(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">ชื่อผู้ปกครอง</Form.Label>
                <Form.Control
                  value={regParentName}
                  onChange={(e) => setRegParentName(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>อาชีพ</Form.Label>
                <Form.Control
                  value={regOccupation3}
                  onChange={(e) => setRegOccupation3(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>รายได้ / เดือน</Form.Label>
                <Form.Control
                  value={regMonthlyIncome3}
                  onChange={(e) => setRegMonthlyIncome3(e.target.value)}
                  type="number"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>บ้านเลขที่</Form.Label>
                <Form.Control
                  value={regHouseNum3}
                  onChange={(e) => setRegHouseNum3(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>หมู่ที่</Form.Label>
                <Form.Control
                  value={regVillageNum3}
                  onChange={(e) => setRegVillageNum3(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label>ถนน/ตรอก/ซอย</Form.Label>
                <Form.Control
                  value={regRoad3}
                  onChange={(e) => setRegRoad3(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>ตำบล/แขวง</Form.Label>
                <Form.Select
                  value={regSubDistrict3}
                  onChange={(e) => setRegSubDistrict3(e.target.value)}
                  disabled={!regDistrict3}
                >
                  <option value="">-- เลือกตำบล --</option>
                  {districts3.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>อำเภอ/เขต</Form.Label>
                <Form.Select
                  value={regDistrict3}
                  onChange={(e) => setRegDistrict3(e.target.value)}
                  disabled={!regProvince3}
                >
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphures3.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>จังหวัด</Form.Label>
                <Form.Select
                  value={regProvince3}
                  onChange={(e) => setRegProvince3(e.target.value)}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces3.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name_th}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-5">
              <Col md={4}>
                <Form.Label>รหัสไปรษณีย์</Form.Label>
                <Form.Control
                  value={regZipcode3}
                  onChange={(e) => setRegZipcode3(e.target.value)}
                  disabled
                />
              </Col>
              <Col md={4}>
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control
                  type="tele"
                  value={regParentNum}
                  onChange={(e) => setRegParentNum(e.target.value)}
                />
              </Col>
            </Row>
          </section>
        )}

        {/* ปุ่ม */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            type="submit"
            className="edit-butt btn-success rounded-pill px-4 py-2"
          >
            บันทึก
          </Button>
          <Button
            type="button"
            className="delete-butt btn-secondary rounded-pill px-4 py-2"
            onClick={() => navigate(-1)}
          >
            ยกเลิก
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header
          closeButton
          className="modal-review-header"
        >
          <Modal.Title>กรุณาตรวจสอบข้อมูลก่อนบันทึก</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-review-body">
          <div className="mb-3">
            <h5 className="mb-2">ข้อมูลผู้ใช้</h5>
            <div className="card review-card mb-3">
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-md-6 d-flex gap-2">
                    <strong>ชื่อ-สกุล:</strong>
                    <div>
                      {formData1.user?.firstName ?? "-"}{" "}
                      {formData1.user?.lastName ?? "-"}
                    </div>
                  </div>
                  <div className="col-md-6 d-flex gap-2">
                    <strong>ตำแหน่ง:</strong>
                    <div>{formData1.user?.position ?? "-"}</div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 d-flex gap-2">
                    <strong>วันเกิด:</strong>
                    <div>{formData1.user?.birthDate ? new Date(formData1.user.birthDate).toLocaleDateString("th-TH") : "-"}</div>
                  </div>
                  <div className="col-md-6 d-flex gap-2">
                    <strong>อายุ:</strong>
                    <div>{formData1.user?.age ?? "-"}</div>
                  </div>
                </div>

                {/* วิชาที่สอน (ถ้ามี) */}
                {formData1.user?.taughtSubject && (
                  <div className="mt-3">
                    <strong>วิชาที่สอน:</strong>
                    <div className="mt-1">
                      {(Array.isArray(formData1.user.taughtSubject)
                        ? formData1.user.taughtSubject
                        : [formData1.user.taughtSubject]
                      ).filter(Boolean).length ? (
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {(Array.isArray(formData1.user.taughtSubject)
                            ? formData1.user.taughtSubject
                            : [formData1.user.taughtSubject]
                          )
                            .filter(Boolean)
                            .map((id) => (
                              <span key={id} className="badge bg-secondary">
                                {id}
                              </span>
                            ))}
                        </div>
                      ) : (
                        <em className="text-muted">-</em>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ข้อมูลบิดา/มารดา/ผู้ปกครอง สรุปแบบ card + list */}
            <div className="row">
              {formData1.father && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card h-100">
                    <div className="card-header bg-light">
                      <strong>บิดา</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData1.father)}
                    </div>
                  </div>
                </div>
              )}
              {formData1.mother && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card h-100">
                    <div className="card-header bg-light">
                      <strong>มารดา</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData1.mother)}
                    </div>
                  </div>
                </div>
              )}
              {formData1.parent && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card h-100">
                    <div className="card-header bg-light">
                      <strong>ผู้ปกครอง</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData1.parent)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr />

          <div className="mb-2">
            <h5 className="mb-2">สรุปที่อยู่</h5>

            <div className="row">
              <div className="col-md-12 mb-3">
                <div className="card review-card">
                  <div className="card-header bg-light">
                    <strong>ที่อยู่ผู้ใช้</strong>
                  </div>
                  <div className="card-body p-2">
                    {renderKeyValueList(formData2.user)}
                  </div>
                </div>
              </div>

              {formData2.father && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card">
                    <div className="card-header bg-light">
                      <strong>ที่อยู่บิดา</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData2.father)}
                    </div>
                  </div>
                </div>
              )}

              {formData2.mother && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card">
                    <div className="card-header bg-light">
                      <strong>ที่อยู่มารดา</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData2.mother)}
                    </div>
                  </div>
                </div>
              )}

              {formData2.parent && (
                <div className="col-md-12 mb-3">
                  <div className="card review-card">
                    <div className="card-header bg-light">
                      <strong>ที่อยู่ผู้ปกครอง</strong>
                    </div>
                    <div className="card-body p-2">
                      {renderKeyValueList(formData2.parent)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button className="delete-butt" onClick={handleCloseModal}>
            ยกเลิก
          </Button>
          <Button className="edit-butt" onClick={handleConfirmSave}>
            ตกลงและบันทึก
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default EditUserProfile;
