import React from "react";

export default function Loader({ size = "w-12 h-12", color = "border-green-500" }) {
  return (
    <div className="flex justify-center items-center py-16">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${size} ${color}`}
      ></div>
    </div>
  );
}
