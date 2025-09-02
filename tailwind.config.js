/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'; // Make sure to import colors

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ADDED: This is the new custom color palette for your theme.
      colors: {
        primary: {
          DEFAULT: colors.emerald[600], // Main emerald green
          hover: colors.emerald[700],
        },
        secondary: {
          DEFAULT: colors.pink[500],   // Main pink for accents
          hover: colors.pink[600],
        },
        background: {
          DEFAULT: '#ffffff',           // Clean white background
          alt: '#f8fafc',               // Off-white for section backgrounds
        },
        'text-primary': '#1e293b',       // Dark slate for main text
        'text-secondary': '#64748b',   // Lighter slate for secondary text
      },
      keyframes: {
        // These animations control movement and opacity, not color, so they remain.
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
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '1',
          },
        }
      },
      animation: {
        'slow-spin': 'move 35s linear infinite',
        'reverse-spin': 'move-alt 45s linear infinite',
        'soft-pulse': 'pulse-soft 10s ease-in-out infinite',
        'pulse-bounce': 'pulse-bounce 1s ease-in-out infinite',
      },
      // UPDATED: Replaced blue/purple gradients with the new emerald/pink gradients.
      backgroundImage: {
        'radial-gradient-emerald': 'radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, rgba(5, 150, 105, 0) 60%)',
        'radial-gradient-pink': 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0) 50%)',
      },
    },
  },
  plugins: [],
}