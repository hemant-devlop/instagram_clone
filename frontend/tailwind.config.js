// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class", // Dark mode using class strategy
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}", // Ensure paths align with your project structure
//   ],
//   theme: {
//     extend: {
//       animation: {
//         fade: "fadeIn 0.5s ease-in-out",
//         "heart-bounce": "heart-bounce 0.6s ease-out both", // Custom animation
//       },
//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//         "heart-bounce": {
//           "0%": { transform: "scale(1)" },      // Normal size
//           "30%": { transform: "scale(1.3)" },   // Slight scale-up
//           "50%": { transform: "scale(1)" },     // Back to normal
//           "100%": { transform: "scale(1)" },    // Reset to normal size
//         },
//       },
//       borderRadius: {
//         lg: "0.5rem",  // Large border radius
//         md: "0.375rem", // Medium border radius
//         sm: "0.25rem",  // Small border radius
//       },
//       colors: {
//         // Add custom colors here if needed
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")], // Ensure this plugin is installed
// };
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust the paths according to your project structure
  ],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn 0.5s ease-in-out",
        "heart-bounce": "heart-bounce 0.6s ease-out both", // Custom animation
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "heart-bounce": {
          "0%": { transform: "scale(1)" },      // Normal size
          "30%": { transform: "scale(1.3)" },   // Slight scale-up
          "50%": { transform: "scale(1)" },     // Back to normal
          "100%": { transform: "scale(1)" },    // Reset to normal size
        },
      },
      borderRadius: {
        lg: "0.5rem",  // Large border radius
        md: "0.375rem", // Medium border radius
        sm: "0.25rem",  // Small border radius
      },
      colors: {
        // Add custom colors here if needed
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Ensure this plugin is installed
};
