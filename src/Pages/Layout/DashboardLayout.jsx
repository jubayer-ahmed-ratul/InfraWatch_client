import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext"; 

export default function DashboardLayout({ onLogout }) {
  const { user: currentUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    logOut();
    navigate("/login");
  };

  const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Issues", path: "/dashboard/my-issues" },
  { name: "Report Issue", path: "/dashboard/report-issue" },
  { name: "Profile", path: "/dashboard/profile" },
];

// যদি admin হয়
if (currentUser?.role === "admin") {
  menuItems.push(
    { name: "Admin Dashboard", path: "/dashboard/admin" },
    { name: "Manage Users", path: "/dashboard/admin/users" },
    { name: "Manage Staff", path: "/dashboard/admin/staff" },
    { name: "Payments", path: "/dashboard/admin/payments" }
  );
}


  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
      
        <div className="mb-6 text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <img
              src={currentUser?.photoURL || "/default-avatar.png"}
              alt={currentUser?.displayName || "No Name"}
              className="w-20 h-20 rounded-full border-2 border-green-500 object-cover"
            />
            {currentUser?.isPremium && (
              <span className="absolute bottom-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>

          <h2 className="font-bold text-lg">{currentUser?.displayName || "No Name"}</h2>
          <p className="text-sm text-gray-500">{currentUser?.role || "User"}</p>

          {currentUser?.isBlocked && (
            <p className="mt-2 text-red-600 text-sm font-medium">
              ⚠ Blocked. Contact authorities.
            </p>
          )}
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
