// =================================================================================
// FILE: vite.config.js
// =================================================================================
// This is the configuration file for Vite, the build tool for this project.
// It defines how the project is built and served for development and production.
// =================================================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // The 'base' option is crucial for deploying to a subfolder on a domain,
  // like with GitHub Pages. It sets the public path for all assets.
  base: '/Costas_Portfolio/',

  plugins: [
    // The react() plugin enables React-specific features like Fast Refresh (HMR)
    // and automatic JSX transformation.
    react(),
  ],
});