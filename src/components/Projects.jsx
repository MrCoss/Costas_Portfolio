// =================================================================================
// FILE: src/components/Projects.jsx
// =================================================================================
// This component displays the portfolio projects in a responsive grid.
// It uses a robust, mobile-first animation strategy to ensure visibility on all
// devices by animating each card individually as it scrolls into view.
// =================================================================================

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection, AnimatedDivider } from './ui'; // Imports reusable UI components

const Projects = React.memo(({ projects, isMobile }) => {
  // Animation variants for the container and individual cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Creates a staggered animation effect
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="projects" className="!py-0">
      <h2 className="text-4xl font-bold text-[#334155] text-center">My Projects</h2>
      <AnimatedDivider />
      <div className="min-h-[60vh] w-full px-4 md:px-0">
        {projects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            // On mobile, animate instantly. On desktop, trigger on scroll for a better effect.
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }} // Trigger when 10% of the grid is visible
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                variants={itemVariants}
                key={project.id}
                className="p-6 flex flex-col rounded-2xl glass-card overflow-hidden"
              >
                <div className="glow-effect"></div>
                <img
                  loading="lazy" // Lazy loading for better performance
                  src={project.imageUrl || 'https://placehold.co/600x400/e2e8f0/334155?text=Project'}
                  alt={project.title}
                  className="rounded-lg mb-4 aspect-video object-cover border border-gray-200/50"
                />
                <h3 className="text-xl font-bold text-[#334155] mb-2">{project.title}</h3>
                <p className="text-[#4b5563] flex-grow mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map(tag => (
                    <span key={tag} className="bg-[#dbeafe] text-[#1e3a8a] text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-center font-semibold text-[#2563eb] border border-[#2563eb] rounded-full py-2 px-4 hover:bg-[#2563eb] hover:text-white transition-all duration-300 z-10"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="min-h-[20vh] flex justify-center items-center">
            <p className="text-center text-[#4b5563] text-lg">
              No projects found. Please add some projects from the admin panel.
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
});

export default Projects;