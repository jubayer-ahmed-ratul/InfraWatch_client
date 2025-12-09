import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-100 shadow-inner mt-10 border-t border-gray-200">
      <div className="max-w-11/12 mx-auto py-10 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1">
          <a
            className="font-bold text-2xl lg:text-3xl mb-2 inline-block"
            href=""
          >
            infra
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
              Watch
            </span>
          </a>
          <p className="text-gray-600 mt-2">
            A Public Infrastructure Issue Reporting System to help citizens{" "}
            <br /> report problems and track government responses efficiently.
          </p>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-green-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/all-issues" className="hover:text-green-600 transition">
                All Issues
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-green-600 transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-green-600 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="">
          <h3 className="font-semibold text-lg mb-3">Contact & Social</h3>
          <p className="text-gray-600">
            Email:{" "}
            <a className="text-green-600" href="mailto:admin@infrawatch.com">
              admin@infrawatch.com
            </a>
          </p>
          <p className="text-gray-600 mt-2">Phone: +880 1234 567890</p>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="text-gray-500 hover:text-green-600 transition"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-green-600 transition"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-green-600 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} InfraWatch. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
