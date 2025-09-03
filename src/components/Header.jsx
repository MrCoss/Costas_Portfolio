// =================================================================================
// FILE: src/components/Header.jsx (FINAL REFACTOR)
// =================================================================================
// This component is now fully theme-aware and uses React's context API to
// manage the theme, eliminating prop drilling.
// =================================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ui/ThemeToggle'; // The toggle component now manages its own state.

// =================================================================================
// Sub-component: NavItem (Refactored for Semantic Dark Mode)
// =================================================================================
const NavItem = ({ href, label, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    // MODIFIED: Use semantic text and hover colors.
    className="group relative flex items-center justify-center p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 hover:text-primary-light dark:hover:text-primary-dark transition-all duration-300"
    aria-label={label}
  >
    {children}
    {/* Tooltip */}
    {/* MODIFIED: Use semantic background and text colors. */}
    <span className="absolute left-full ml-3 px-3 py-1.5 whitespace-nowrap text-sm font-medium text-white dark:text-background-dark bg-text-primary-light dark:bg-text-primary-dark rounded-md shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
      {label}
    </span>
  </a>
);

// =================================================================================
// Main Component: Header (Final Refactor)
// =================================================================================
const Header = React.memo(({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
  // REFACTORED: `theme` and `toggleTheme` are no longer passed as props.
  // The ThemeToggle component will use the `useTheme` hook internally.

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  const handleLinkClick = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    closeMobileMenu();

    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-primary-light/10 dark:border-primary-dark/20">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Home Icon Link */}
        <NavItem href="#home" label="Home" onClick={handleLinkClick}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1z" /></svg>
        </NavItem>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-text-secondary-light dark:text-text-secondary-dark">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick} className="hover:text-secondary-light dark:hover:text-secondary-dark transition-colors">
              {link.label}
            </a>
          ))}
          {/* REFACTORED: No longer pass props to ThemeToggle */}
          <ThemeToggle />
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-4">
          {/* REFACTORED: No longer pass props to ThemeToggle */}
          <ThemeToggle />
          {/* MODIFIED: Use semantic text colors for the icon. */}
          <button onClick={toggleMobileMenu} className="text-text-primary-light dark:text-text-primary-dark focus:outline-none p-1" aria-label="Toggle menu">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            // MODIFIED: Use semantic background and text colors.
            className="md:hidden absolute top-full left-0 w-full bg-background-light dark:bg-background-dark z-40 shadow-lg px-6 py-4 space-y-3 text-text-secondary-light dark:text-text-secondary-dark font-medium"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={handleLinkClick} className="block py-2 hover:text-secondary-light dark:hover:text-secondary-dark">
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;