import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  AlertCircle,
  PlusCircle,
  User,
  Shield,
  Users,
  CreditCard,
  FileText,
  Briefcase,
  CheckCircle,
  Settings
} from "lucide-react";

export default function DashboardLayout({ onLogout }) {
  const { user: currentUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    logOut();
    navigate("/login");
  };

  const menuByRole = {
    admin: [
      { name: "Admin Dashboard", path: "/dashboard/admin", icon: <Shield /> },
      { name: "All Issues", path: "/dashboard/admin/allissues", icon: <AlertCircle /> },
      { name: "Manage Users", path: "/dashboard/admin/users", icon: <Users /> },
      { name: "Manage Staff", path: "/dashboard/admin/staff", icon: <Briefcase /> },
      { name: "Payments", path: "/dashboard/admin/payments", icon: <CreditCard /> },
    ],
    staff: [
      { name: "Staff Dashboard", path: "/dashboard/staff", icon: <Briefcase /> },
      { name: "Assigned Issues", path: "/dashboard/staff/assigned-issues", icon: <CheckCircle /> },
      { name: "Profile", path: "/dashboard/staff/profile", icon: <Settings /> },
    ],
    user: [
      { name: "Dashboard", path: "/dashboard", icon: <Home /> },
      { name: "My Issues", path: "/dashboard/my-issues", icon: <FileText /> },
      { name: "Report Issue", path: "/dashboard/report-issue", icon: <PlusCircle /> },
      { name: "Profile", path: "/dashboard/profile", icon: <User /> },
    ],
  };

  const menuItems = menuByRole[currentUser?.role || "user"];

  return (
    <div className="flex h-screen bg-gray-50">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "fixed z-40" : "relative"}
          ${isSidebarCollapsed && !isMobile ? "w-20" : "w-64"}
          h-screen bg-white shadow-lg p-4 flex flex-col
          transition-all duration-300
        `}
      >
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4"
          >
            <X />
          </button>
        )}

        {/* Profile */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-xl font-bold">
            {currentUser?.displayName?.[0] || "U"}
          </div>
          {!isSidebarCollapsed && (
            <>
              <h3 className="font-semibold mt-2">{currentUser?.displayName}</h3>
              <p className="text-xs text-gray-500">{currentUser?.role}</p>
            </>
          )}
        </div>

        {/* Back Home */}
        <NavLink
          to="/"
          className={`flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-gray-100 hover:bg-green-100
            ${isSidebarCollapsed && !isMobile ? "justify-center" : ""}
          `}
        >
          <Home className="w-5 h-5" />
          {!isSidebarCollapsed && <span>Back to Home</span>}
        </NavLink>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                ${isActive ? "bg-green-200 text-green-800" : "hover:bg-green-100"}
                ${isSidebarCollapsed && !isMobile ? "justify-center" : ""}`
              }
            >
              {item.icon}
              {!isSidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`mt-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg
            ${isSidebarCollapsed && !isMobile ? "justify-center" : ""}
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <button
          onClick={() =>
            isMobile ? setIsSidebarOpen(!isSidebarOpen) : setIsSidebarCollapsed(!isSidebarCollapsed)
          }
          className="mb-4 p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobile ? <Menu /> : isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        <Outlet />
      </main>
    </div>
  );
}
