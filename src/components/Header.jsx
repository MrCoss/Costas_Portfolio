import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        {/* Home Icon Link */}
        <NavItem href="#home" label="Home" onClick={handleLinkClick}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1z" /></svg>
        </NavItem>
        
        {/* Desktop Navigation now uses only text links */}
        <div className="hidden md:flex space-x-4 items-center font-medium text-[#4b5563]">
          <a href="#about" onClick={handleLinkClick} className="hover:text-[#2563eb] transition-colors">About</a>
          <a href="#experience" onClick={handleLinkClick} className="hover:text-[#2563eb] transition-colors">Experience</a>
          <a href="#skills" onClick={handleLinkClick} className="hover:text-[#2563eb] transition-colors">Skills</a>
          <a href="#projects" onClick={handleLinkClick} className="hover:text-[#2563eb] transition-colors">Projects</a>
          <a href="#contact" onClick={handleLinkClick} className="hover:text-[#2563eb] transition-colors">Contact</a>
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
