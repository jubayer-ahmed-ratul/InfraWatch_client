// routes/StaffRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext/AuthContext";

const StaffRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "staff") return <Navigate to="/dashboard" />;

  return <Outlet />;
};

export default StaffRoute;