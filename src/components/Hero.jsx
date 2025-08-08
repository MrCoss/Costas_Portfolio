// =================================================================================
// FILE: src/Hero.jsx
// =================================================================================
// This component renders the main hero section (the top banner) of the portfolio.
// It features an eye-catching typing animation for the subtitle to highlight
// key skills and is memoized for performance.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx'; 

const Hero = React.memo(() => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center text-center md:text-left relative overflow-hidden">
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-3"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#334155] mb-4">
            <span className="block mb-2 text-xl font-normal text-[#64748b]">Hello, I'm</span> Costas Pinto
          </h1>
          
          {/* AI Typing animation for the subtitle */}
          <TypeAnimation
            sequence={[
              'Data Science Enthusiast', 2000,
              'Machine Learning Engineer', 2000,
              'Full-Stack Developer', 2000,
              'AI Innovator', 2000,
            ]}
            wrapper="p"
            speed={50}
            className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] h-10"
            repeat={Infinity}
          />
          
          <p className="max-w-xl text-[#4b5563] leading-relaxed mb-8 mx-auto md:mx-0">
            Transforming raw data into actionable insights. I build intelligent systems and solve complex problems with a passion for machine learning and data visualization.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            {/* ACTION REQUIRED: 
              1. Place your CV file inside the '/public/assets/' folder.
              2. Make sure the file is named 'CostasPinto_CV.pdf'.
            */}
            <motion.a
              href="/assets/CostasPinto_CV.pdf"
              download="CostasPinto_CV.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-[#2563eb]/20 transition-all hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Download CV
            </motion.a>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2563eb] transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
              <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#334155] transition-colors">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg>
              </a>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          className="md:col-span-2 flex justify-center items-center relative"
        >
          <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-gradient-to-tr from-[#2563eb]/20 via-[#1e3a8a]/20 to-[#2563eb]/30 rounded-full opacity-40 blur-3xl" />
            <div className="relative z-10 flex justify-center items-center">
              {/* FIX: Corrected image path for robustness */}
              <img loading="lazy" src="/assets/Costas.png" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/334155?text=CP'; }} alt="Costas Pinto" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-contain z-10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default Hero;