// =================================================================================
// FILE: src/components/Header.jsx
// =================================================================================
// This component renders the main navigation header for the site.
// It is memoized for performance and handles smooth scrolling for anchor links,
// as well as the open/close state for the responsive mobile menu.
// =================================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center text-[#4b5563] font-medium">
          <a href="#about" className="hover:text-[#2563eb] transition-colors">About</a>
          <a href="#experience" className="hover:text-[#2563eb] transition-colors">Experience</a>
          <a href="#skills" className="hover:text-[#2563eb] transition-colors">Skills</a>
          <a href="#projects" className="hover:text-[#2563eb] transition-colors">Projects</a>
          <a href="#contact" className="hover:text-[#2563eb] transition-colors">Contact</a>
        </div>
        
        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-[#4b5563] focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
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