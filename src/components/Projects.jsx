// =================================================================================
// FILE: src/components/Projects.jsx
// =================================================================================
// This component displays the portfolio projects in a responsive, animated layout.
// It features a mobile-first design with a clean, stacked card UI for smaller
// screens, and transitions to a multi-column grid on larger devices.
// =================================================================================

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Projects = memo(({ projects }) => {
  // Animation variants for the container and individual project cards.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="projects">
      <h2 className="text-4xl font-bold text-slate-700 text-center">My Projects</h2>
      <AnimatedDivider />
      <div className="min-h-[60vh] w-full">
        {projects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            // On mobile, this will be a single column. On medium screens and up, it becomes a grid.
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                variants={itemVariants}
                key={project.id}
                // MOBILE STYLES: A solid background for better readability.
                // DESKTOP STYLES (md:): Transitions to the glass card effect.
                className="p-6 flex flex-col rounded-2xl bg-white shadow-lg md:bg-white/20 md:backdrop-blur-lg md:border md:border-white/30 transition-all duration-300 md:hover:shadow-2xl md:hover:shadow-blue-500/20 md:hover:-translate-y-1 overflow-hidden"
              >
                <img
                  loading="lazy"
                  src={project.imageUrl || 'https://placehold.co/600x400/e2e8f0/334155?text=Project'}
                  alt={project.title}
                  className="rounded-lg mb-4 aspect-video object-cover border border-slate-200/50"
                />
                <h3 className="text-xl font-bold text-slate-700 mb-2">{project.title}</h3>
                <p className="text-slate-600 flex-grow mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-center font-semibold text-blue-600 border border-blue-600 rounded-full py-2 px-4 hover:bg-blue-600 hover:text-white transition-all duration-300 z-10"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="min-h-[20vh] flex justify-center items-center">
            <p className="text-center text-slate-500 text-lg">
              No projects found. Please add some from the admin panel.
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
});

export default Projects;
