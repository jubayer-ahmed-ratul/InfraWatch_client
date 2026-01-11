import React from 'react';
import { ToastContainer } from 'react-toastify';
import useTheme from '../../hooks/useTheme';

const ThemeAwareToast = () => {
  const { isDarkMode } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? 'dark' : 'light'}
      toastStyle={{
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        color: isDarkMode ? '#f9fafb' : '#1f2937',
        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      }}
      progressStyle={{
        background: isDarkMode 
          ? 'linear-gradient(90deg, #10b981, #34d399)' 
          : 'linear-gradient(90deg, #059669, #10b981)'
      }}
    />
  );
};

export default ThemeAwareToast;