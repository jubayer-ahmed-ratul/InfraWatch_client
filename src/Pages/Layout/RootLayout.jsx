import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Home/Shared/Navbar/Navbar';
import Footer from '../Home/Shared/Footer/Footer';

const RootLayout = () => {
    return (
       <div>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
       </div>
    );
};

export default RootLayout;