import { toast } from 'react-toastify';
import useTheme from './useTheme';

const useToast = () => {
  const { isDarkMode } = useTheme();

  const getToastStyle = (type) => {
    const baseStyle = {
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#1f2937',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    };

    const borderColors = {
      success: '#10b981',
      error: '#ef4444', 
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    return {
      ...baseStyle,
      border: `1px solid ${borderColors[type] || '#e5e7eb'}`,
      borderLeft: `4px solid ${borderColors[type] || '#e5e7eb'}`,
    };
  };

  const getProgressStyle = (type) => {
    const gradients = {
      success: 'linear-gradient(90deg, #10b981, #34d399)',
      error: 'linear-gradient(90deg, #ef4444, #f87171)',
      warning: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      info: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
    };

    return {
      background: gradients[type] || gradients.info,
    };
  };

  const showToast = {
    success: (message, options = {}) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: getToastStyle('success'),
        progressStyle: getProgressStyle('success'),
        ...options,
      });
    },

    error: (message, options = {}) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: getToastStyle('error'),
        progressStyle: getProgressStyle('error'),
        ...options,
      });
    },

    warning: (message, options = {}) => {
      toast.warning(message, {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: getToastStyle('warning'),
        progressStyle: getProgressStyle('warning'),
        ...options,
      });
    },

    info: (message, options = {}) => {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: getToastStyle('info'),
        progressStyle: getProgressStyle('info'),
        ...options,
      });
    },

    // CRUD operation specific toasts
    created: (itemName = 'Item') => {
      showToast.success(`✅ ${itemName} created successfully!`);
    },

    updated: (itemName = 'Item') => {
      showToast.success(`📝 ${itemName} updated successfully!`);
    },

    deleted: (itemName = 'Item') => {
      showToast.success(`🗑️ ${itemName} deleted successfully!`);
    },

    saved: (itemName = 'Changes') => {
      showToast.success(`💾 ${itemName} saved successfully!`);
    },

    // Common app operations
    loginSuccess: (userName = 'User') => {
      showToast.success(`🎉 Welcome back, ${userName}!`);
    },

    logoutSuccess: () => {
      showToast.info(`👋 Logged out successfully!`);
    },

    uploadSuccess: (fileName = 'File') => {
      showToast.success(`📤 ${fileName} uploaded successfully!`);
    },

    copySuccess: (item = 'Content') => {
      showToast.success(`📋 ${item} copied to clipboard!`);
    },
  };

  return { showToast, isDarkMode };
};

export default useToast;