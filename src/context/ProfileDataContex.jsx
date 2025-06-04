import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../firebase";
import {
  doc,
  collection,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const userProfile = createContext();

export function ProfileDataContextProvider({ children }) {
  const [profileData, setProfileData] = useState([]);

  const loadRealtime = () => {
    const unsubscribe = onSnapshot(collection(db, "profile"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfileData(newData);
    });

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

  async function userDelete(id) {
    try {
      await deleteDoc(doc(db, "profile", id));
      await deleteDoc(doc(db, "address", id));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  return (
    <userProfile.Provider value={{ profileData, userDelete }}>
      {children}
    </userProfile.Provider>
  );
}

export function useUserProfile() {
  return useContext(userProfile);
}
