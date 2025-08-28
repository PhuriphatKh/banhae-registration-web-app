import React, { useState, useEffect, useRef } from "react";
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
  deleteField
} from "firebase/firestore";
import logo from "../assets/logo.png";

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
  const [regBirthday, setRegBirthday] = useState("");
  const [regAge, setRegAge] = useState(0);
  const [regBornAt, setRegBornAt] = useState("");
  const [regNationality, setRegNationality] = useState("");
  const [regEthnicity, setRegEthnicity] = useState("");
  const [regReligion, setRegReligion] = useState("");
  const [regIDCard, setRegIDCard] = useState(0);
  const [regBirthOrder, setRegBirthOrder] = useState(0);
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

  let menuRef1 = useRef();
  let menuRef2 = useRef();
  let menuRef3 = useRef();
  let menuRef4 = useRef();
  let menuRef5 = useRef();
  let menuRef6 = useRef();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    if (id) setProfileID(id);
  }, [location.search]);

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
        setRegTeleNum(newData.address?.user?.teleNum || "");

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

        console.log("ProfileData:", newData);
      }
    );

    return () => unsubscribe();
  }, [profileID]);

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

        console.log("AddressData:", newData);
      }
    );

    return () => unsubscribe();
  }, [profileID]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const newData = [];
      snapshot.forEach((doc) => {
        newData.push({ id: doc.id, ...doc.data() });
      });
      if (newData.length === 0) return;

      setSubjects(newData);
      console.log("Subjects updated:", newData);
    });

    return () => unsubscribe();
  }, []);

  // ที่อยู่ ---------------------------------------------------- //
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    )
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  useEffect(() => {
    if (!regProvince) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince)
        );
        setAmphures(filtered);
        // setRegDistrict(""); // reset
        // setRegSubDistrict(""); // reset
      });
  }, [regProvince]);

  useEffect(() => {
    if (!regDistrict) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict)
        );
        setDistricts(filtered);
        // setRegSubDistrict(""); // reset
      });
  }, [regDistrict]);

  useEffect(() => {
    if (!regSubDistrict) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict)
        );
        if (selectedSubDistrict) {
          setRegZipcode(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      });
  }, [regSubDistrict]);
  // ---------------------------------------------------------------- //

  // ที่อยู่เกิด ---------------------------------------------------- //
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    )
      .then((res) => res.json())
      .then(setProvinces1);
  }, []);

  useEffect(() => {
    if (!regBirthProvinceID) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regBirthProvinceID)
        );
        setAmphures1(filtered);
        // setRegDistrict(""); // reset
        // setRegSubDistrict(""); // reset
      });
  }, [regBirthProvinceID]);

  useEffect(() => {
    if (!regBirthDistrictID) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regBirthDistrictID)
        );
        setDistricts1(filtered);
        // setRegSubDistrict(""); // reset
      });
  }, [regBirthDistrictID]);

  useEffect(() => {
    const province = provinces1.find(
      (a) => a.id === parseInt(regBirthProvinceID)
    );
    if (province) {
      setBirthProvince("จังหวัด" + province.name_th);
    }

    const district = amphures1.find(
      (a) => a.id === parseInt(regBirthDistrictID)
    );
    if (district) {
      setBirthDistrict(district.name_th);
    }

    const subdistrict = districts1.find(
      (a) => a.id === parseInt(regBirthSubDistrictID)
    );
    if (subdistrict) {
      setBirthSubDistrict(subdistrict.name_th);
    }
  }, [regBirthProvinceID, regBirthDistrictID, regBirthSubDistrictID]);

  useEffect(() => {
    setRegBornAt(
      regBirthSubDistrict + " " + regBirthDistrict + " " + regBirthProvince
    );
  });
  // ---------------------------------------------------------------- //

  // --- useEffect สำหรับบิดา ---
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    )
      .then((res) => res.json())
      .then(setProvinces1);
  }, []);

  useEffect(() => {
    if (!regProvince1) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince1)
        );
        setAmphures1(filtered);
      });
  }, [regProvince1]);

  useEffect(() => {
    if (!regDistrict1) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict1)
        );
        setDistricts1(filtered);
      });
  }, [regDistrict1]);

  useEffect(() => {
    if (
      !regSubDistrict1 ||
      !provinces1.length ||
      !amphures1.length ||
      !districts1.length
    )
      return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict1)
        );
        if (selectedSubDistrict) {
          setRegZipcode1(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      });
  }, [regSubDistrict1, provinces1, amphures1, districts1]);

  // --- useEffect สำหรับมารดา ---
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    )
      .then((res) => res.json())
      .then(setProvinces2);
  }, []);

  useEffect(() => {
    if (!regProvince2) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince2)
        );
        setAmphures2(filtered);
      });
  }, [regProvince2]);

  useEffect(() => {
    if (!regDistrict2) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict2)
        );
        setDistricts2(filtered);
      });
  }, [regDistrict2]);

  useEffect(() => {
    if (
      !regSubDistrict2 ||
      !provinces2.length ||
      !amphures2.length ||
      !districts2.length
    )
      return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict2)
        );
        if (selectedSubDistrict) {
          setRegZipcode2(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      });
  }, [regSubDistrict2, provinces2, amphures2, districts2]);

  // --- useEffect สำหรับผู้ปกครอง ---
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
    )
      .then((res) => res.json())
      .then(setProvinces3);
  }, []);

  useEffect(() => {
    if (!regProvince3) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (a) => a.province_id === parseInt(regProvince3)
        );
        setAmphures3(filtered);
      });
  }, [regProvince3]);

  useEffect(() => {
    if (!regDistrict3) return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d) => d.amphure_id === parseInt(regDistrict3)
        );
        setDistricts3(filtered);
      });
  }, [regDistrict3]);

  useEffect(() => {
    if (
      !regSubDistrict3 ||
      !provinces3.length ||
      !amphures3.length ||
      !districts3.length
    )
      return;
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const selectedSubDistrict = data.find(
          (d) => d.id === parseInt(regSubDistrict3)
        );
        if (selectedSubDistrict) {
          setRegZipcode3(selectedSubDistrict.zip_code); // กำหนดรหัสไปรษณีย์
        }
      });
  }, [regSubDistrict3, provinces3, amphures3, districts3]);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef1.current.contains(e.target)) {
        setOpen1(false);
      }

      if (!menuRef2.current.contains(e.target)) {
        setOpen2(false);
      }

      if (!menuRef3.current.contains(e.target)) {
        setOpen3(false);
      }

      if (!menuRef4.current.contains(e.target)) {
        setOpen4(false);
      }

      if (!menuRef5.current.contains(e.target)) {
        setOpen5(false);
      }

      if (!menuRef6.current.contains(e.target)) {
        setOpen6(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
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
          classLevel: regClassLevel,
          taughtSubject: regTaughtSubjects,
          birthDate: regBirthday,
          ethnicity: regEthnicity,
          nationality: regNationality,
          religion: regReligion,
        },
        father: {
          fullName: regFatherName,
          occupation: regOccupation1,
          monthlyIncome: regMonthlyIncome1,
        },
        mother: {
          fullName: regMotherName,
          occupation: regOccupation2,
          monthlyIncome: regMonthlyIncome2,
        },
        parent: {
          fullName: regParentName,
          occupation: regOccupation3,
          monthlyIncome: regMonthlyIncome3,
        },
      };

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
        father: {
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
        },
        mother: {
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
        },
        parent: {
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
        },
      };

      setFormData1(userProfile);
      setFormData2(userAddress);
      setShowModal(true);

      // บันทึกข้อมูลโปรไฟล์ลง Firestore
      // await setDoc(doc(db, "profile", profileID), userProfile, { merge: true });
      // บันทึกข้อมูลที่อยู่ของผู้ใช้ลง Firestore
      // await setDoc(doc(db, "address", profileID), userAddress, { merge: true });

      // console.log("Data updated successfully in Firestore!");
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleConfirmSave = async () => {
    try {
      // ถ้าเปลี่ยนวิชาที่สอน ให้ลบ teacher ออกจากวิชาเดิม
      if (prevTaughtSubject && Array.isArray(prevTaughtSubject)) {
        prevTaughtSubject.forEach(async (subjId) => {
          if (!regTaughtSubjects.includes(subjId)) {
        // ดึงข้อมูลวิชาเดิม
        const subjDoc = await getDoc(doc(db, "subjects", subjId));
        if (subjDoc.exists()) {
          const teachersArr = Array.isArray(subjDoc.data().teachers)
            ? subjDoc.data().teachers
            : [];
          // ลบ profileID ออกจาก array
          const updatedTeachers = teachersArr.filter((id) => id !== profileID);
          await setDoc(
            doc(db, "subjects", subjId),
            { teachers: updatedTeachers },
            { merge: true }
          );
        }
          }
        });
      }
      // เพิ่ม teacher ในวิชาใหม่
      if (regTaughtSubjects && Array.isArray(regTaughtSubjects)) {
        regTaughtSubjects.forEach(async (subjId) => {
          if (subjId) {
        const subjDoc = await getDoc(doc(db, "subjects", subjId));
        let teachersArr = [];
        if (subjDoc.exists()) {
          teachersArr = Array.isArray(subjDoc.data().teachers)
            ? subjDoc.data().teachers
            : [];
        }
        // เพิ่ม profileID ถ้ายังไม่มี
        if (!teachersArr.includes(profileID)) {
          teachersArr.push(profileID);
          await setDoc(
            doc(db, "subjects", subjId),
            { teachers: teachersArr },
            { merge: true }
          );
        }
          }
        });
      }
      // บันทึกข้อมูลใน Firestore
      await setDoc(doc(db, "profile", profileID), formData1, { merge: true });
      await setDoc(doc(db, "address", profileID), formData2, { merge: true });
      console.log("Data saved successfully!");
      setShowModal(false);
      setPrevTaughtSubject(regTaughtSubjects);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

        <div className="menu-container">
          {/* เมนู ทะเบียน */}
          <div className="dropdown" ref={menuRef2}>
            <div className="dropdown-trigger" onClick={() => setOpen2(!open2)}>
              <div className="custom-h5">ทะเบียน</div>
              <svg
                className={`dropdown-icon ${open2 ? "rotate" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <div
              className={`dropdown-content ${open2 ? "active" : "inactive"}`}
            >
              <Link to="/profile">ข้อมูลส่วนตัว</Link>
              <Link to="/usermanagement">จัดการข้อมูลผู้ใช้</Link>
              <Link to="/subjects-management">จัดการรายวิชา</Link>
              <Link to="/time-table-management">จัดการตารางเวลา</Link>
              <Link to="/student-table-management">จัดการตารางเรียน</Link>
              <Link to="/teacher-table-management">จัดการตารางสอน</Link>
            </div>
          </div>

          {/* เมนู ประมวลผล */}
          <div className="dropdown" ref={menuRef3}>
            <div className="dropdown-trigger" onClick={() => setOpen3(!open3)}>
              <div className="custom-h5">ประมวลผลการเรียน</div>
              <svg
                className={`dropdown-icon ${open3 ? "rotate" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
            <div
              className={`dropdown-content ${open3 ? "active" : "inactive"}`}
            >
              <Link to="/school-record-management">จัดการผลการเรียน</Link>
            </div>
          </div>

          {/* เมนู คำร้อง */}
          <div className="dropdown">
            <div className="dropdown-trigger">
              <div className="custom-h5">คำร้อง</div>
              <svg
                className="dropdown-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* โปรไฟล์ */}
        <div className="dropdown-container" ref={menuRef1}>
          <div className="dropdown-trigger" onClick={() => setOpen1(!open1)}>
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
            <div className="custom-h5">{firstName}</div>
          </div>
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
            <div className="custom-h4">
              {firstName} {lastName}
            </div>
            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              <div className="custom-h5">ออกจากระบบ</div>
            </button>
          </div>
        </div>
      </div>

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
                      <Form.Select
                        value={subjectId}
                        onChange={e => {
                          const newArr = [...regTaughtSubjects];
                          newArr[idx] = e.target.value;
                          setRegTaughtSubjects(newArr);
                        }}
                      >
                        <option value="" disabled>
                          -- เลือกวิชาที่สอน --
                        </option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.id} {subject.name}
                          </option>
                        ))}
                      </Form.Select>
                      {regTaughtSubjects.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => {
                            setRegTaughtSubjects(regTaughtSubjects.filter((_, i) => i !== idx));
                          }}
                        >ลบ</Button>
                      )}
                    </div>
                  ))}
                  <hr />
                  <Button
                    size="sm"
                    className="edit-butt"
                    onClick={() => setRegTaughtSubjects([...regTaughtSubjects, ""])}
                  >เพิ่มวิชาที่สอน</Button>
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
                onChange={(e) => setRegBirthday(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Label>อายุ</Form.Label>
              <Form.Control disabled />
            </Col>
            <Col md={6} className="position-relative">
              <Form.Label>เกิดที่</Form.Label>
              <Form.Control
                value={regBornAt}
                onClick={() => setOpen4(!open4)}
                readOnly
              />
              <div
                ref={menuRef4}
                className={`birth-address-1 ${open4 ? "active" : "inactive"}`}
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
                className={`birth-address-2 ${open5 ? "active" : "inactive"}`}
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
                className={`birth-address-3 ${open6 ? "active" : "inactive"}`}
              >
                {districts1.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                    onClick={(e) => {
                      setOpen6(!open6), setBirthSubDistrictID(e.target.value);
                    }}
                  >
                    {d.name_th}
                  </option>
                ))}
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>กรุณาตรวจสอบข้อมูล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>ข้อมูลผู้ใช้</h5>
          <p>
            <strong>ชื่อ: </strong>
            {formData1.firstName} {formData1.lastName}
          </p>
          <p>
            <strong>ตำแหน่ง: </strong>
            {formData1.position}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="footer">
        <div className="custom-h3">ติดต่อเรา</div>
      </div>
    </div>
  );
}

export default EditUserProfile;
