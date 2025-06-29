/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  
  daisyui: {
    themes: [
      {
        myblue: {
          "primary": "#3b82f6",   // Tailwind's blue-500
          "primary-focus": "#2563eb", // blue-600
          "primary-content": "#ffffff", // white text on primary
          
          "secondary": "#7c3aed", // violet-600
          "accent": "#06b6d4",    // cyan-500
          "neutral": "#1f2937",   // gray-800
          "base-100": "#ffffff",  // white background
          
          "info": "#0ea5e9",      // sky-500
          "success": "#10b981",   // emerald-500
          "warning": "#f59e0b",   // amber-500
          "error": "#ef4444",     // red-500
        },
      },
      "light", // keep light theme as fallback
      "dark",  // keep dark theme as fallback
    ],
  },

  plugins: [
    require("daisyui")
  ],
}