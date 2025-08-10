// =================================================================================
// FILE: src/components/Hero.jsx
// =================================================================================
// This component renders a clean and dynamic hero section with a modern dark theme.
// It uses Framer Motion for animations, React Type Animation for the headline,
// and custom styling to create a glowing circular border for the hero image.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import heroImage from '../assets/Hero.png';

const Hero = React.memo(() => {
  // Framer Motion variants for orchestrating entrance animations.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  // Inline style for the subtle grid background pattern.
  const gridBackgroundStyle = {
    '--grid-color': 'rgba(100, 116, 139, 0.2)', // slate-600 with opacity
    '--grid-size': '40px',
    backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: 'var(--grid-size) var(--grid-size)',
  };


  return (
    <section
      id="home"
      // MODIFICATION: Switched to a dark theme and added a grid background.
      className="min-h-screen flex items-center justify-center text-center md:text-left bg-slate-900 overflow-hidden"
      style={gridBackgroundStyle}
    >
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center">
        {/* Left Column: Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-3"
        >
          <motion.h1
            variants={itemVariants}
            // MODIFICATION: Updated text colors for dark background.
            className="text-5xl md:text-7xl font-extrabold text-slate-100 mb-4"
          >
            <span className="block mb-2 text-xl font-medium text-slate-400">
              Hello, I'm
            </span>
            Costas Pinto
          </motion.h1>

          <motion.div variants={itemVariants}>
            <TypeAnimation
              sequence={[
                'AI Innovator', 2000,
                'Data Analyst', 2000,
                'Data Scientist', 2000,
                'Problem Solver', 2000,
                'Creative Thinker', 2000,
              ]}
              wrapper="p"
              speed={50}
              // MODIFICATION: Adjusted gradient for better visibility on dark theme.
              className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 h-10"
              repeat={Infinity}
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            // MODIFICATION: Updated text color.
            className="max-w-xl text-slate-300 leading-relaxed mb-8 mx-auto md:mx-0"
          >
            Transforming raw data into actionable insights. I build
            intelligent systems and solve complex problems with a
            passion for machine learning and data visualization.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6"
          >
            <motion.a
              href="/CostasPinto_CV.pdf"
              download="CostasPinto_CV.pdf"
              whileHover={{
                scale: 1.05,
                boxShadow: '0px 10px 30px rgba(99, 102, 241, 0.4)', // Purple shadow
              }}
              whileTap={{ scale: 0.95 }}
              // MODIFICATION: New button style for dark theme.
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              <FaDownload />
              Download CV
            </motion.a>

            <div className="flex gap-4">
              <motion.a
                whileHover={{ y: -3 }}
                href="https://www.linkedin.com/in/costaspinto/"
                target="_blank"
                rel="noopener noreferrer"
                // MODIFICATION: Updated icon colors.
                className="text-slate-400 hover:text-purple-400 transition-colors"
              >
                <FaLinkedin size={32} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com/MrCoss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <FaGithub size={32} />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Animated Image with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            // Re-enabled floating animation
            y: [-8, 8],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            scale: { duration: 0.8, delay: 0.4, type: 'spring' },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatType: "reverse" },
          }}
          className="md:col-span-2 flex justify-center items-center"
        >
          {/* MODIFICATION: New structure for circular image with glow */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            {/* The Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            {/* The Image itself, clipped to a circle */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-slate-700">
              <img
                loading="lazy"
                src={heroImage}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x400/0f172a/94a3b8?text=CP';
                }}
                alt="Costas Pinto"
                className="w-full h-full object-cover" // Ensures the image fills the circle
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default Hero;
