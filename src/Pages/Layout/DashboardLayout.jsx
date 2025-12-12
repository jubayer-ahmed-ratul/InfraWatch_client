
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Issues", path: "/dashboard/my-issues" },
    { name: "Report Issue", path: "/dashboard/report-issue" },
    { name: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <div className="mb-10 text-center">
          <img
            src={currentUser?.photoURL || "/default-avatar.png"}
            alt={currentUser?.name}
            className="w-16 h-16 mx-auto rounded-full mb-2"
          />
          <h2 className="font-bold text-lg">{currentUser?.name}</h2>
          <p className="text-sm text-gray-500">{currentUser?.role || "User"}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium hover:bg-green-100 ${
                  isActive ? "bg-green-200 text-green-700" : "text-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
