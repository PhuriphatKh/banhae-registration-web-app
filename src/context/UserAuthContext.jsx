import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getAuth,
} from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { auth, firebaseConfig, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    const secondaryApp = initializeApp(firebaseConfig, "Secondary");
    let newUser = null;
    try {
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      newUser = userCredential.user;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้:", error);
    } finally {
      await deleteApp(secondaryApp);
    }

    return newUser;
  }

  function logOut() {
    return signOut(auth);
  }

  const userPermission = async (user) => {
    let role = "";
    try {
      const userDoc = await getDoc(doc(db, "profile", user.uid));
      if (userDoc.exists()) {
        role = userDoc.data().position;
        setUserRole(role);
        localStorage.setItem("userRole", role);
      } else {
        console.log("No such user document");
      }
    } catch (err) {
      console.log(err);
    }

    return role;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserdata = async () => {
      if (user && user.uid) {
        try {
          const userDoc = await getDoc(doc(db, "profile", user.uid));
          if (userDoc.exists()) {
            setFirstName(userDoc.data().firstName);
            setLastName(userDoc.data().lastName);
          } else {
            console.log("No such user document");
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("No data");
      }
    };

    if (user && user.uid) {
      fetchUserdata();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      userPermission(user);
    }
  }, [user]);

  return (
    <userAuthContext.Provider
      value={{
        user,
        userPermission,
        userRole,
        firstName,
        lastName,
        logIn,
        signUp,
        logOut,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
