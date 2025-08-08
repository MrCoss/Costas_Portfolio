// =================================================================================
// FILE: src/Header.jsx
// =================================================================================
// This component renders the main navigation header for the site.
// It features an icon-based desktop menu with hover-to-reveal text labels
// and a standard text-based menu for mobile.
// =================================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

// A new, reusable sub-component for each navigation item.
// This makes the main Header component cleaner and easier to read.
const NavItem = ({ href, label, children, onClick }) => (
  <a href={href} onClick={onClick} className="group relative flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300">
    {children}
    {/* This is the text label that appears on hover */}
    <span className="absolute left-full ml-3 px-3 py-1.5 whitespace-nowrap text-sm font-medium text-white bg-gray-800 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 pointer-events-none">
      {label}
    </span>
  </a>
);

const Header = React.memo(({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
  // This handler ensures smooth scrolling and closes the mobile menu upon navigation.
  const handleLinkClick = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    closeMobileMenu();
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // A small delay ensures the menu-closing animation doesn't interfere.
    }
  };

  return (
    <header className="bg-white/70 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200/80">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="flex items-center space-x-2" onClick={handleLinkClick}>
          <img src="/Costas_Portfolio/assets/logo.png" alt="Logo" className="h-10 w-auto md:h-12" />
        </a>
        
        {/* UPDATE: Desktop Navigation now uses icons with hover labels */}
        <div className="hidden md:flex space-x-4 items-center">
          <NavItem href="#about" label="About" onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </NavItem>
          <NavItem href="#experience" label="Experience" onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </NavItem>
          <NavItem href="#skills" label="Skills" onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </NavItem>
          <NavItem href="#projects" label="Projects" onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </NavItem>
          <NavItem href="#contact" label="Contact" onClick={handleLinkClick}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </NavItem>
        </div>
        
        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-[#4b5563] focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown (remains text-based for better usability) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-md px-6 py-4 space-y-3 text-[#4b5563] font-medium"
          >
            <a href="#about" onClick={handleLinkClick} className="block hover:text-[#2563eb]">About</a>
            <a href="#experience" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Experience</a>
            <a href="#skills" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Skills</a>
            <a href="#projects" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Projects</a>
            <a href="#contact" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
