import React, { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../../../components/ThemeToggle/ThemeToggle";

const Navbar = () => {
  const { user, loading, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = (
    <>
      <li><a href="/" className="text-lg font-medium px-4 hover:text-green-600 transition">Home</a></li>
      <li><a href="/allissues" className="text-lg font-medium px-4 hover:text-green-600 transition">All Issues</a></li>
      <li><a href="/dashboard" className="text-lg font-medium px-4 hover:text-green-600 transition">Dashboard</a></li>
    </>
  );

  if (loading) {
    return (
      <div className="bg-base-100 shadow-md">
        <div className="navbar max-w-11/12 mx-auto">
          <div className="navbar-start"><div className="skeleton w-32 h-10"></div></div>
          <div className="navbar-end"><div className="skeleton w-24 h-10 rounded-full"></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar max-w-11/12 mx-auto">

        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-52 z-50">
              {navItems}
            </ul>
          </div>
          <a className="font-bold text-xl lg:text-3xl cursor-pointer" onClick={() => navigate("/")}>
            infra
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
              Watch
            </span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        <div className="navbar-end gap-4">
          <ThemeToggle />
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar flex items-center justify-center cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || user.email} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                      {user.email ? user.email[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              </div>

              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-50">
                <li className="p-4 border-b">
                  <div className="flex flex-col">
                    <span className="font-bold">{user.displayName || user.email}</span>
                    <span className="text-sm text-base-content/60">{user.email}</span>
                  </div>
                </li>
                <li><a href="/dashboard" className="justify-between">Dashboard <span className="badge badge-success">New</span></a></li>
                <li><a href="/dashboard/profile">Profile</a></li>
              
                <li><button onClick={handleLogout} className="text-red-500">Logout</button></li>
              </ul>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="btn bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transition text-lg">
              Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
