import React from "react";
import { Navigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

function GuestRoute({ children }) {
  const { user } = useUserAuth();

  if (user) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default GuestRoute;
