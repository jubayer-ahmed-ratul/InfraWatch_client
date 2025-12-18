import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext"; 
import { Menu, X, ChevronLeft, ChevronRight, LogOut, User } from "lucide-react";

export default function DashboardLayout({ onLogout }) {
  const { user: currentUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const sidebarRef = useRef(null);
  const userMenuRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // Always open on desktop
      } else {
        setIsSidebarOpen(false); // Closed by default on mobile
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    logOut();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard",  },
    { name: "My Issues", path: "/dashboard/my-issues",  },
    { name: "Report Issue", path: "/dashboard/report-issue",  },
    { name: "Profile", path: "/dashboard/profile",  },
  ];

  if (currentUser?.role === "admin") {
    menuItems.push(
      { name: "Admin Dashboard", path: "/dashboard/admin",  },
      { name: "Issues", path: "/dashboard/admin/allissues", },
      { name: "Manage Users", path: "/dashboard/admin/users", },
      { name: "Manage Staff", path: "/dashboard/admin/staff",  },
      { name: "Payments", path: "/dashboard/admin/payments",  },
    );
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };


  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

 
  const getUserInitials = () => {
    if (!currentUser?.displayName) return "U";
    return currentUser.displayName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

  
      <aside
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"}
          ${isSidebarCollapsed && !isMobile ? "w-20" : "w-64"}
          bg-white shadow-lg p-4 md:p-6 flex flex-col
          transition-all duration-300 ease-in-out
          ${!isMobile && !isSidebarCollapsed ? "translate-x-0" : ""}
        `}
      >
     
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}

       
        <div className={`mb-6 ${isSidebarCollapsed && !isMobile ? "px-0 text-center" : "text-center"}`}>
          <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-2">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser?.displayName || "No Name"}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-green-500 object-cover"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-green-500 bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                {getUserInitials()}
              </div>
            )}
            {currentUser?.isPremium && (
              <span className="absolute bottom-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                P
              </span>
            )}
          </div>

          {(!isSidebarCollapsed || isMobile) && (
            <>
              <h2 className="font-bold text-sm md:text-lg truncate">
                {currentUser?.displayName || "No Name"}
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                {currentUser?.role || "User"}
              </p>

              {currentUser?.isBlocked && (
                <p className="mt-2 text-red-600 text-xs font-medium">
                  Blocked
                </p>
              )}
            </>
          )}
        </div>

      
        <nav className="flex-1 space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavLinkClick}
              className={({ isActive }) => `
                flex items-center px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium hover:bg-green-100
                ${isActive ? "bg-green-200 text-green-700" : "text-gray-700"}
                ${isSidebarCollapsed && !isMobile ? "justify-center" : ""}
              `}
              title={isSidebarCollapsed && !isMobile ? item.name : ""}
            >
              <span className="mr-2 md:mr-3">{item.icon}</span>
              {(!isSidebarCollapsed || isMobile) && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

      
        <button
          onClick={handleLogout}
          className={`
            mt-auto px-3 py-2 md:px-4 md:py-2 bg-red-500 text-white rounded-lg 
            hover:bg-red-600 transition flex items-center justify-center
            ${isSidebarCollapsed && !isMobile ? "px-2" : ""}
          `}
          title={isSidebarCollapsed && !isMobile ? "Logout" : ""}
        >
          {(!isSidebarCollapsed || isMobile) && "Logout"}
          <LogOut className={`w-4 h-4 ${isSidebarCollapsed && !isMobile ? "" : "hidden"}`} />
        </button>
      </aside>

 
      <main className="flex-1 p-4 md:p-6">
     
        <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b">
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isMobile ? "Toggle Menu" : isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isMobile ? (
              <Menu className="w-6 h-6" />
            ) : isSidebarCollapsed ? (
              <ChevronRight className="w-6 h-6" />
            ) : (
              <ChevronLeft className="w-6 h-6" />
            )}
          </button>


      
            

           
        
        </div>

        <Outlet />
      </main>
    </div>
  );
}