// =================================================================================
// FILE: src/components/ui/ThemeToggle.jsx (FINAL REFACTOR)
// =================================================================================
// This component is now self-contained and uses the custom 'useTheme' hook
// to access and toggle the application's theme, eliminating prop drilling.
// =================================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
// REFACTORED: Import the useTheme hook directly.
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  // REFACTORED: Use the hook to get the theme state and toggle function.
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full text-text-primary-light dark:text-text-primary-dark bg-slate-200/50 dark:bg-slate-800/80 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          // Use isDarkMode directly for the key and conditional rendering
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;