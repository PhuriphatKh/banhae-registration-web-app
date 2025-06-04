import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const StudentGradesContext = createContext();

export function StudentGradesContexProvider({ children }) {
  const [studentGradesData, setStudentGradesData] = useState([]);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(
      collection(db, "student_grades"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudentGradesData(newData);
      }
    );

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    const unsubscribe = loadRealtime();

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <StudentGradesContext.Provider value={{ studentGradesData }}>
      {children}
    </StudentGradesContext.Provider>
  );
}

export function useStudentGrades() {
  return useContext(StudentGradesContext);
}
