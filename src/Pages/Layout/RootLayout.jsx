import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Home/Shared/Navbar/Navbar';
import Footer from '../Home/Shared/Footer/Footer';

const RootLayout = () => {
    return (
       <div className="bg-base-100 min-h-screen">
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
       </div>
    );
};

export default RootLayout;