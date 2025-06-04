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

const studentTable = createContext();

export function StudentTableContexProvider({ children }) {
  const [studentTableData, setStudentTableData] = useState([]);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(
      collection(db, "student_table"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudentTableData(newData);
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
    <studentTable.Provider value={{ studentTableData }}>
      {children}
    </studentTable.Provider>
  );
}

export function useStudentTable() {
  return useContext(studentTable);
}
