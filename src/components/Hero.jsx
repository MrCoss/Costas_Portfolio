// =================================================================================
// FILE: src/components/Hero.jsx
// =================================================================================
// This component renders a clean and dynamic hero section. It has been updated
// to a bright, modern theme featuring the emerald, pink, and white color palette.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import heroImage from '../assets/Hero.png';

const Hero = React.memo(() => {
  // UPDATED: Inline style for a subtle grid on a light background.
  const gridBackgroundStyle = {
    '--grid-color': 'rgba(30, 41, 59, 0.05)', // A very light version of text-primary
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
      // UPDATED: Section background is now the theme's 'bg-background' (white).
      className="min-h-screen flex items-center justify-center text-center md:text-left bg-background overflow-hidden"
      style={gridBackgroundStyle}
    >
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div className="md:col-span-3">
          <h1
            // UPDATED: Heading now uses theme colors for primary and secondary text.
            className="text-5xl md:text-7xl font-extrabold text-text-primary mb-4"
          >
            <span className="block mb-2 text-xl font-medium text-text-secondary">
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
              // UPDATED: Typewriter animation gradient is now primary (emerald) to secondary (pink).
              className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary h-10"
              repeat={Infinity}
            />
          </div>

          <p
            // UPDATED: Paragraph text now uses the theme's secondary text color.
            className="max-w-xl text-text-secondary leading-relaxed mb-8 mx-auto md:mx-0"
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
                // UPDATED: Hover shadow now uses the primary (emerald) color.
                boxShadow: '0px 10px 30px rgba(16, 185, 129, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              // UPDATED: Download button now uses the primary-to-secondary gradient.
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
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
                // UPDATED: Social icons now use theme colors with a pink hover effect.
                className="text-text-secondary hover:text-secondary transition-colors"
              >
                <FaLinkedin size={32} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com/MrCoss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-secondary transition-colors"
              >
                <FaGithub size={32} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Image with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          className="md:col-span-2 flex justify-center items-center"
        >
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            {/* UPDATED: The glow effect now uses the primary-to-secondary gradient. */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-50"></div>
            {/* UPDATED: Image border now uses a subtle shade of the primary color. */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-primary/20">
              <img
                loading="lazy"
                src={heroImage}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x400/ffffff/1e293b?text=CP';
                }}
                alt="Costas Pinto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default Hero;