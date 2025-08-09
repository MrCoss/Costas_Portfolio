// =================================================================================
// FILE: postcss.config.js
// =================================================================================
// This configuration file is for PostCSS, a tool for transforming CSS with
// JavaScript plugins. Vite uses it under the hood to process your styles.
// This setup enables Tailwind CSS and Autoprefixer.
// =================================================================================

export default {
  plugins: {
    // Integrates Tailwind CSS into the PostCSS process. This plugin scans your
    // HTML, JSX, and other files for class names and generates the corresponding
    // CSS, including any customizations from your tailwind.config.js file.
    tailwindcss: {},

    // Autoprefixer automatically adds vendor prefixes (like -webkit-, -moz-, etc.)
    // to your CSS rules, ensuring cross-browser compatibility without you
    // having to write them manually.
    autoprefixer: {},
  },
};
