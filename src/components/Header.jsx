// =================================================================================
// FILE: src/components/Header.jsx
// =================================================================================
// This component renders the main navigation header for the portfolio. It is
// designed to be fully responsive, featuring a clean, text-based navigation for
// desktop and an animated, slide-down menu for mobile devices. It is memoized
// for optimal performance.
// =================================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =================================================================================
// Sub-component: NavItem
// A reusable component for icon-based navigation links with a hover tooltip.
// =================================================================================
const NavItem = ({ href, label, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="group relative flex items-center justify-center p-2 rounded-full text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
    aria-label={label}
  >
    {children}
    {/* The text label tooltip that appears on hover */}
    <span className="absolute left-full ml-3 px-3 py-1.5 whitespace-nowrap text-sm font-medium text-white bg-slate-800 rounded-md shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
      {label}
    </span>
  </a>
);

// =================================================================================
// Main Component: Header
// Manages the overall header structure, state, and responsive behavior.
// =================================================================================
const Header = React.memo(({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
  // This handler provides smooth scrolling to section anchors and ensures the
  // mobile menu is closed upon navigation.
  const handleLinkClick = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    // Always close the mobile menu when a link is clicked.
    closeMobileMenu();

    if (targetElement) {
      // A brief timeout prevents the menu-closing animation from interfering
      // with the start of the smooth scroll animation.
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-slate-200/80">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Home Icon Link */}
        <NavItem href="#home" label="Home" onClick={handleLinkClick}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1z" /></svg>
        </NavItem>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium text-slate-600">
          <a href="#about" onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">About</a>
          <a href="#experience" onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">Experience</a>
          <a href="#skills" onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">Skills</a>
          <a href="#projects" onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">Projects</a>
          <a href="#contact" onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
        
        {/* Mobile Menu Button (Hamburger/Close Icon) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-slate-600 focus:outline-none p-1">
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
            className="md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-lg px-6 py-4 space-y-3 text-slate-600 font-medium"
          >
            <a href="#about" onClick={handleLinkClick} className="block py-2 hover:text-blue-600">About</a>
            <a href="#experience" onClick={handleLinkClick} className="block py-2 hover:text-blue-600">Experience</a>
            <a href="#skills" onClick={handleLinkClick} className="block py-2 hover:text-blue-600">Skills</a>
            <a href="#projects" onClick={handleLinkClick} className="block py-2 hover:text-blue-600">Projects</a>
            <a href="#contact" onClick={handleLinkClick} className="block py-2 hover:text-blue-600">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
