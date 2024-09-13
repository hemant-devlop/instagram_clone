/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust the paths according to your project structure
  ],
  theme: {
  	extend: {
      animation: {
        'heart-bounce': 'heart-bounce 0.6s ease-out both', // Custom animation name
      },
      keyframes: {
        'heart-bounce': {
          '0%': { transform: 'scale(1)' },      // Start at normal size
          '30%': { transform: 'scale(1.3)' },   // Scale up slightly
          '50%': { transform: 'scale(1)' },     // Scale back to normal
          // '70%': { transform: 'scale(1.2)' },   // Slightly scale up again
          '100%': { transform: 'scale(1)' },    // Back to normal size
        }
      },
      borderRadius: {
    lg: '0.5rem', // or another default value
    md: '0.375rem',
    sm: '0.25rem'
  },
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
