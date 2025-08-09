// =================================================================================
// FILE: vite.config.js
// =================================================================================
// This is the configuration file for Vite, the build tool used for this project.
// It defines how the development server runs, how the project is bundled for
// production, and sets up essential plugins and path aliases.
// =================================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the 'path' module for resolving file paths

// https://vitejs.dev/config/
export default defineConfig({
  // The 'base' option is crucial for deploying to a subfolder on a domain,
  // such as with GitHub Pages. It tells Vite to prefix all asset paths with
  // this value, ensuring that files are loaded correctly from the sub-directory.
  base: '/Costas_Portfolio/', 

  // This tells Vite to use the 'public' directory for static assets. Any files
  // in this directory will be copied to the root of the build output directory.
  // This is essential for assets like favicons, robots.txt, or the 404.html hack
  // for single-page app routing on GitHub Pages.
  publicDir: 'public',

  plugins: [
    // The official Vite plugin for React. It enables features like Fast Refresh
    // (Hot Module Replacement) for a better development experience and handles
    // JSX transformation.
    react(),
  ],

  // The 'resolve' option allows for customizing how Vite locates modules.
  resolve: {
    // 'alias' creates shortcuts for import paths, making them cleaner and
    // easier to manage. This is a robust fix for avoiding complex relative
    // paths like '../../components'.
    alias: {
      // The '@' alias is a common convention that points to the 'src' directory.
      // Now you can import components like: `import Component from '@/components/Component.jsx'`
      '@': path.resolve(__dirname, './src'),
    },
  },
})
