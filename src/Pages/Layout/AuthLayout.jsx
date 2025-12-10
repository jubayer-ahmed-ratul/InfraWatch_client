import React from "react";
import Navbar from "../Home/Shared/Navbar/Navbar";
import Footer from "../Home/Shared/Footer/Footer";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex justify-around items-center py-10">
       <div className="w-[60%]">
         <Outlet></Outlet>
       </div>
        <div className="w-[30%]">
            <img className="rounded-3xl" src="https://i.ibb.co.com/PZLT9mFz/authimage.png" alt="" />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AuthLayout;
