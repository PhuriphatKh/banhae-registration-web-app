import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function StudentRoute({ children }) {
  const { userRole } = useUserAuth();

  if (userRole !== "นักเรียน") {
    return <Navigate to={`/home/${userRole}`} />;
  }

  return children;
}

export default StudentRoute;
