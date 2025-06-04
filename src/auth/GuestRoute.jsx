import React from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function GuestRoute({ children }) {
  const { user, userRole } = useUserAuth();

  if (user) {
    return <Navigate to={`/home/${userRole}`} />;
  }

  return children;
}

export default GuestRoute;
