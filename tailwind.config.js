/** @type {import('tailwindcss').Config} */
export default {
  // Use the 'class' strategy for dark mode, which is already correct.
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // REFACTORED: Use a single, semantic name for each color token
      // and define its light and dark values within.
      colors: {
        // Semantic color tokens that adapt to light/dark mode.
        primary: {
          light: '#3D9A8B', // Dark Teal
          dark: '#63C2D2', // Light Blue (brighter for contrast in dark mode)
        },
        secondary: {
          light: '#63C2D2', // Light Blue
          dark: '#2EB19F', // Medium Teal
        },
        background: {
          light: '#FFFFFF',
          dark: '#1A202C', // Very Dark Blue-Gray
          'alt-light': '#F8FAFC', // Off-white
          'alt-dark': '#2D3748', // Dark Gray-Blue
        },
        'text-primary': {
          light: '#2D3748', // Dark Gray-Blue
          dark: '#F7FAFC', // Off-white
        },
        'text-secondary': {
          light: '#718096', // Medium Gray-Blue
          dark: '#A0AEC0', // Light Gray
        },
      },
      keyframes: {
        // Retaining your existing animations.
        move: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'move-alt': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        'pulse-bounce': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
        },
      },
      animation: {
        'slow-spin': 'move 35s linear infinite',
        'reverse-spin': 'move-alt 45s linear infinite',
        'soft-pulse': 'pulse-soft 10s ease-in-out infinite',
        'pulse-bounce': 'pulse-bounce 1s ease-in-out infinite',
      },
      // REFACTORED: Gradients are now semantically named.
      backgroundImage: {
        'radial-gradient-primary': 'radial-gradient(circle, rgba(61, 154, 139, 0.2) 0%, rgba(61, 154, 139, 0) 60%)',
        'radial-gradient-secondary': 'radial-gradient(circle, rgba(99, 194, 210, 0.15) 0%, rgba(99, 194, 210, 0) 50%)',
        'radial-gradient-primary-dark': 'radial-gradient(circle, rgba(99, 194, 210, 0.25) 0%, rgba(99, 194, 210, 0) 60%)',
        'radial-gradient-secondary-dark': 'radial-gradient(circle, rgba(46, 177, 159, 0.2) 0%, rgba(46, 177, 159, 0) 50%)',
      },
    },
  },
  plugins: [],
}
