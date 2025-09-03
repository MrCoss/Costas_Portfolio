// =================================================================================
// FILE: src/components/Hero.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a consistent and fully semantic color palette
// for a seamless dark mode experience and a more maintainable structure.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa';
import heroImage from '../assets/Hero.png';

const Hero = React.memo(() => {
  return (
    <section
      id="home"
      // MODIFIED: Use semantic background colors for the main container.
      className="relative min-h-screen flex items-center justify-center text-center md:text-left bg-background-light dark:bg-background-dark overflow-hidden
      before:absolute before:inset-0 before:w-full before:h-full before:bg-[linear-gradient(to_right,rgba(30,41,59,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.05)_1px,transparent_1px)]
      dark:before:bg-[linear-gradient(to_right,rgba(203,213,225,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(203,213,225,0.05)_1px,transparent_1px)]
      before:bg-[size:40px_40px]"
    >
      {/* z-10 ensures content is above the pseudo-element grid */}
      <div className="relative z-10 container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div className="md:col-span-3">
          <h1
            // MODIFIED: Use semantic text colors.
            className="text-5xl md:text-7xl font-extrabold text-text-primary-light dark:text-text-primary-dark mb-4"
          >
            <span className="block mb-2 text-xl font-medium text-text-secondary-light dark:text-text-secondary-dark">
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
              // MODIFIED: Use semantic gradient color tokens.
              className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark h-10"
              repeat={Infinity}
            />
          </div>

          <p
            // MODIFIED: Use semantic text colors.
            className="max-w-xl text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-8 mx-auto md:mx-0"
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
                // Note: CSS variables are not directly available in Framer Motion styles.
                // The provided code is already a workaround for this.
              }}
              whileTap={{ scale: 0.95 }}
              // MODIFIED: Use semantic gradient and text colors.
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white dark:text-text-primary-dark font-bold py-3 px-8 rounded-full shadow-lg transition-all"
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
                // MODIFIED: Use semantic text and hover colors.
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors"
              >
                <FaLinkedin size={32} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="https://github.com/MrCoss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors"
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
            {/* MODIFIED: Use semantic gradient and border colors for the glow effect. */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full blur-2xl opacity-50 dark:opacity-40"></div>
            {/* MODIFIED: Use semantic border colors. */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-primary-light/20 dark:border-primary-dark/20">
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