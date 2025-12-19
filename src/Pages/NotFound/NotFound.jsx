import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex flex-col items-center justify-center  px-4">
      <img
        src="https://i.ibb.co.com/LhqgMqzB/Gemini-Generated-Image-syw86hsyw86hsyw8.png"
        alt="Page Not Found"
        className="max-w-sm w-full mb-6"
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Oops! The page you are looking for doesn’t exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
