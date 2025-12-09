import React from "react";

const Navbar = () => {
  const navItems = (
    <>
      <li>
        <a className="text-lg font-medium px-4  hover:text-green-600 transition">
          Home
        </a>
      </li>
      <li>
        <a className="text-lg font-medium px-4  hover:text-green-600 transition">
          All Issues
        </a>
      </li>
      <li>
        <a className="text-lg font-medium px-4 hover:text-green-600 transition">
          More
        </a>
      </li>
    </>
  );

  return (
    <div className="bg-base-100 shadow-md">
      <div className="navbar  max-w-11/12 mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-52 z-10"
            >
              {navItems}
            </ul>
          </div>
          <a className="font-bold text-xl lg:text-3xl" href="">
            infra
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
              Watch
            </span>
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        <div className="navbar-end">
          <a className="btn bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transition text-lg">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
