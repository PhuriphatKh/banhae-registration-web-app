import React from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function ManagerRoute({ children }) {
  const { userRole } = useUserAuth();

  if (userRole !== "ผู้อำนวยการ") {
    return <Navigate to={`/home/${userRole}`} />;
  }

  return children;
}

export default ManagerRoute;
