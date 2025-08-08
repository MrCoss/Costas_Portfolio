// =================================================================================
// FILE: tailwind.config.js
// =================================================================================
// This is the configuration file for Tailwind CSS. It allows you to customize
// every aspect of the framework, from your color palette to breakpoints, and
// importantly, tells Tailwind which files to scan for class names.
// =================================================================================

/** @type {import('tailwindcss').Config} */
export default {
  // The 'content' array tells Tailwind where to look for class names.
  // It's configured to scan your main HTML file and all JavaScript/JSX
  // files within the 'src' directory to ensure all used classes are generated.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // The 'theme' object is where you would customize Tailwind's default design system.
  // The 'extend' key allows you to add new values without overwriting the defaults.
  // For example, you could add custom colors, fonts, or spacing here.
  theme: {
    extend: {},
  },

  // The 'plugins' array is where you can add official or third-party plugins
  // to extend Tailwind's functionality, such as for typography or forms.
  plugins: [],
}