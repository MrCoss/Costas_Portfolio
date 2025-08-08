import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  // The 'base' option is crucial for deploying to a subfolder on a domain,
  // like with GitHub Pages.
  base: '/Costas_Portfolio/', 

  plugins: [
    react(),
  ],

  // FIX: Added a resolve alias to make sure Vite always knows where
  // to find your source files, which is a robust fix for pathing issues.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})