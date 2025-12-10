import React from "react";
import Navbar from "../Home/Shared/Navbar/Navbar";
import Footer from "../Home/Shared/Footer/Footer";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 pt-2 px-4 md:px-16 flex-grow">
        
        <div className="w-full md:w-1/2 lg:w-2/5 p-6 md:p-10 rounded-xl ">
          <Outlet />
        </div>

        <div className="w-full md:w-1/2 lg:w-2/5 flex justify-center">
          <img 
            className="w-full rounded-3xl shadow-lg"
            src="https://i.ibb.co.com/PZLT9mFz/authimage.png" 
            alt="Auth Banner" 
          />
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default AuthLayout;
