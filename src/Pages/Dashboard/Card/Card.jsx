// Card.js
import React from 'react';

export const Card = ({ title, value, icon, color, trend }) => {
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color || 'from-blue-500 to-cyan-500'}`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-base-content/70 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-base-content">{value}</p>
      </div>
    </div>
  );
};
