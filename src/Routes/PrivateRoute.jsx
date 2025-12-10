import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ currentUser, children }) {
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
