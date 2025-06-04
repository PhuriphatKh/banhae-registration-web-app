import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

const TeacherTableContext = createContext();

export function TeacherTableContexProvider({ children }) {
  const [teacherTableData, setTeacherTableData] = useState([]);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(
      collection(db, "teacher_table"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeacherTableData(newData);
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
    <TeacherTableContext.Provider value={{ teacherTableData }}>
      {children}
    </TeacherTableContext.Provider>
  );
}

export function useTeacherTable() {
  return useContext(TeacherTableContext);
}
