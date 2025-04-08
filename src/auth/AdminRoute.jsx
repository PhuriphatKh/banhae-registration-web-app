import React, { useEffect } from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function AdminRoute({ children }) {
  const { userRole } = useUserAuth();

  if (userRole !== "admin") {
    return <Navigate to={`/home/${userRole}`} />;
  }

  return children;
}

export default AdminRoute;
