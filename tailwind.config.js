/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
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
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
        }
      },
      animation: {
        'slow-spin': 'move 35s linear infinite',
        'reverse-spin': 'move-alt 45s linear infinite',
        'soft-pulse': 'pulse-soft 10s ease-in-out infinite',
        // New combined animation to resolve the conflict
        'spin-pulse-combo': 'move 35s linear infinite, pulse-soft 10s ease-in-out infinite',
        'loading-spin': 'spin 1.5s linear infinite',
        'loading-pulse': 'pulse 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'radial-gradient-blue': 'radial-gradient(circle, rgba(37, 99, 235, 0.1), transparent 50%), radial-gradient(circle, rgba(29, 78, 216, 0.08), transparent 60%)',
        'radial-gradient-purple': 'radial-gradient(circle, rgba(124, 58, 237, 0.08), transparent 50%), radial-gradient(circle, rgba(109, 40, 217, 0.07), transparent 60%)',
      },
    },
  },
  plugins: [],
}
