import React from 'react';
import useTheme from '../../hooks/useTheme';

const DarkModeTest = () => {
  const { isDarkMode, theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-lg">
        <h3 className="font-bold text-base-content mb-2">Dark Mode Test</h3>
        <p className="text-base-content/70 text-sm mb-3">
          Current theme: <span className="font-semibold">{theme}</span>
        </p>
        <button
          onClick={toggleTheme}
          className="btn btn-primary btn-sm w-full"
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </div>
  );
};

export default DarkModeTest;