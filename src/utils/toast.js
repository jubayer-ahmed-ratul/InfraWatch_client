import { toast } from 'react-toastify';

// Custom toast configurations that work well with both themes
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastConfig,
      style: {
        background: 'var(--toast-bg, #ffffff)',
        color: 'var(--toast-text, #1f2937)',
        border: '1px solid #10b981',
      },
      progressStyle: {
        background: 'linear-gradient(90deg, #10b981, #34d399)',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      style: {
        background: 'var(--toast-bg, #ffffff)',
        color: 'var(--toast-text, #1f2937)',
        border: '1px solid #ef4444',
      },
      progressStyle: {
        background: 'linear-gradient(90deg, #ef4444, #f87171)',
      },
    });
  },

  warning: (message) => {
    toast.warning(message, {
      ...toastConfig,
      style: {
        background: 'var(--toast-bg, #ffffff)',
        color: 'var(--toast-text, #1f2937)',
        border: '1px solid #f59e0b',
      },
      progressStyle: {
        background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      },
    });
  },

  info: (message) => {
    toast.info(message, {
      ...toastConfig,
      style: {
        background: 'var(--toast-bg, #ffffff)',
        color: 'var(--toast-text, #1f2937)',
        border: '1px solid #3b82f6',
      },
      progressStyle: {
        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
      },
    });
  },

  // Custom themed toasts
  successDark: (message) => {
    toast.success(message, {
      ...toastConfig,
      style: {
        background: '#1f2937',
        color: '#f9fafb',
        border: '1px solid #10b981',
      },
    });
  },

  errorDark: (message) => {
    toast.error(message, {
      ...toastConfig,
      style: {
        background: '#1f2937',
        color: '#f9fafb',
        border: '1px solid #ef4444',
      },
    });
  },
};