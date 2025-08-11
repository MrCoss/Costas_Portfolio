// =================================================================================
// FILE: src/components/Hero.jsx
// =================================================================================
// This component renders a clean and dynamic hero section with a modern dark theme.
// It uses simple animations for a professional feel, featuring a typing
// animation for the headline and a subtle glow for the hero image.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import heroImage from '../assets/Hero.png';

const Hero = React.memo(() => {
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
      className="min-h-screen flex items-center justify-center text-center md:text-left bg-slate-900 overflow-hidden"
      style={gridBackgroundStyle}
    >
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div
          className="md:col-span-3"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold text-slate-100 mb-4"
          >
            <span className="block mb-2 text-xl font-medium text-slate-400">
              Hello, I'm
            </span>
            Costas Pinto
          </h1>

          <div>
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
              className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 h-10"
              repeat={Infinity}
            />
          </div>

          <p
            className="max-w-xl text-slate-300 leading-relaxed mb-8 mx-auto md:mx-0"
          >
            Transforming raw data into actionable insights. I build
            intelligent systems and solve complex problems with a
            passion for machine learning and data visualization.
          </p>

          <div
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
          </div>
        </div>

        {/* Right Column: Animated Image with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          className="md:col-span-2 flex justify-center items-center"
        >
          {/* MODIFICATION: New structure for circular image with glow */}
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            {/* The Glow Effect (MODIFICATION: Removed pulse animation) */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-2xl opacity-60"></div>
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
