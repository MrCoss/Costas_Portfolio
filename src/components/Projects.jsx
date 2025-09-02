// =================================================================================
// FILE: src/components/Projects.jsx
// =================================================================================
// This component displays the portfolio projects and now includes a versatile
// media renderer that can display images, videos, or links to PDFs.
// =================================================================================

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';
import { FaFilePdf } from 'react-icons/fa';

// =================================================================================
// Sub-component: ProjectMedia
// Renders the correct media type (image, video, PDF) based on the URL.
// =================================================================================
const ProjectMedia = memo(({ mediaUrl, title }) => {
  if (!mediaUrl) {
    return (
      <img
        loading="lazy"
        src={'https://placehold.co/600x400/e2e8f0/334155?text=Project'}
        alt={title}
        className="rounded-lg mb-4 aspect-video object-cover border border-primary/10"
      />
    );
  }

  const isVideo = ['.mp4', '.webm', '.mov'].some(ext => mediaUrl.toLowerCase().includes(ext));
  const isPdf = mediaUrl.toLowerCase().includes('.pdf');

  if (isVideo) {
    return (
      <video
        src={mediaUrl}
        controls
        className="rounded-lg mb-4 aspect-video object-cover border border-primary/10 w-full"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (isPdf) {
    return (
      <a 
        href={mediaUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="rounded-lg mb-4 aspect-video object-cover border border-primary/10 w-full flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
      >
        <FaFilePdf className="text-6xl text-red-500" />
        <span className="mt-2 font-semibold text-text-secondary">View PDF</span>
      </a>
    );
  }
  
  // Default to rendering as an image
  return (
    <img
      loading="lazy"
      src={mediaUrl}
      alt={title}
      className="rounded-lg mb-4 aspect-video object-cover border border-primary/10"
    />
  );
});


// =================================================================================
// Main Component: Projects
// =================================================================================
const Projects = memo(({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="projects">
      <h2 className="text-4xl font-bold text-text-primary text-center">My Projects</h2>
      <AnimatedDivider />
      <div className="min-h-[60vh] w-full">
        {projects.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                variants={itemVariants}
                key={project.id}
                className="p-6 flex flex-col rounded-2xl bg-white shadow-lg border border-primary/10 md:bg-white/20 md:backdrop-blur-lg md:border-white/30 transition-all duration-300 md:hover:shadow-2xl md:hover:shadow-primary/20 md:hover:-translate-y-1 overflow-hidden"
              >
                {/* MODIFIED: Replaced simple img tag with the new ProjectMedia component */}
                <ProjectMedia mediaUrl={project.mediaUrl} title={project.title} />
                
                <h3 className="text-xl font-bold text-text-primary mb-2">{project.title}</h3>
                <p className="text-text-secondary flex-grow mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map(tag => (
                    <span key={tag} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-center font-semibold text-secondary border border-secondary rounded-full py-2 px-4 hover:bg-secondary hover:text-white transition-all duration-300 z-10"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="min-h-[20vh] flex justify-center items-center">
            <p className="text-center text-text-secondary text-lg">
              No projects found. Please add some from the admin panel.
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
});

export default Projects;
