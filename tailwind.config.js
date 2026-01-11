/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#10b981", // green-500
          "primary-focus": "#059669", // green-600
          secondary: "#f3f4f6", // gray-100
          accent: "#34d399", // green-400
          neutral: "#374151", // gray-700
          "base-100": "#ffffff",
          "base-200": "#f9fafb", // gray-50
          "base-300": "#e5e7eb", // gray-200
          "base-content": "#1f2937", // gray-800
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#10b981", // green-500
          "primary-focus": "#059669", // green-600
          secondary: "#374151", // gray-700
          accent: "#34d399", // green-400
          neutral: "#d1d5db", // gray-300
          "base-100": "#1f2937", // gray-800
          "base-200": "#111827", // gray-900
          "base-300": "#374151", // gray-700
          "base-content": "#f9fafb", // gray-50
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}