import React from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function TeacherRoute({ children }) {
  const { userRole } = useUserAuth();

  if (userRole !== "ครู") {
    return <Navigate to={`/home/${userRole}`} />;
  }

  return children;
}

export default TeacherRoute;
