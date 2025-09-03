// =================================================================================
// FILE: src/components/Projects.jsx (FINAL REFACTOR)
// =================================================================================
// This component is now updated to correctly handle project media from both
// direct image/video URLs and generic PDF links.
// =================================================================================

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';
import { FaFilePdf } from 'react-icons/fa';

// =================================================================================
// Sub-component: ProjectMedia (Refactored for Semantic Dark Mode)
// =================================================================================
const ProjectMedia = memo(({ mediaUrl, title }) => {
  if (!mediaUrl) {
    return (
      <img
        loading="lazy"
        src={'https://placehold.co/600x400/e2e8f0/334155?text=Project'}
        alt={title}
        className="rounded-lg mb-4 aspect-video object-cover border border-primary-light/10 dark:border-primary-dark/20"
      />
    );
  }

  // REFACTORED: The logic is simplified. We'll only explicitly check for
  // video file extensions. Any other URL will be treated as an image or a PDF.
  const isVideo = ['.mp4', '.webm', '.mov'].some(ext => mediaUrl.toLowerCase().includes(ext));

  // We can't reliably detect PDFs from a generic URL, so we'll just display
  // a PDF icon and let the user click the link.
  const isPdf = mediaUrl.toLowerCase().includes('pdf'); // Better, but still not foolproof for GDrive links

  if (isVideo) {
    return (
      <video
        src={mediaUrl}
        controls
        className="rounded-lg mb-4 aspect-video object-cover border border-primary-light/10 dark:border-primary-dark/20 w-full"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // The isPdf check is unreliable. A better approach for the PDF link from Google Drive is to display a standard thumbnail or a PDF icon.
  // Since you're linking to the PDF, a visual cue is most important.
  // We'll revert to a placeholder image for generic links and let the 'View Project' button handle the click.
  
  // MODIFIED: This code block will handle both generic images and PDF links
  return (
    <div
      className="rounded-lg mb-4 aspect-video border border-primary-light/10 dark:border-primary-dark/20 w-full flex flex-col items-center justify-center bg-background-alt-light dark:bg-background-alt-dark transition-colors"
    >
      <img
        loading="lazy"
        src={mediaUrl}
        alt={title}
        className="w-full h-full object-cover"
        // This onError is for handling cases where the image link might be broken
        onError={(e) => {
          // If the media is a PDF, we can show a placeholder
          if (mediaUrl.includes('pdf')) {
            e.target.src = 'https://placehold.co/600x400/e2e8f0/334155?text=PDF';
          } else {
            e.target.src = 'https://placehold.co/600x400/e2e8f0/334155?text=Project';
          }
        }}
      />
    </div>
  );
});


// =================================================================================
// Main Component: Projects (Refactored for Semantic Dark Mode)
// =================================================================================
const Projects = memo(({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="projects">
      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">My Projects</h2>
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
                className="p-6 flex flex-col rounded-2xl bg-white dark:bg-background-alt-dark shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 border border-primary-light/10 dark:border-primary-dark/20 md:bg-white/20 md:dark:bg-slate-800/20 md:backdrop-blur-lg md:border-white/30 transition-all duration-300 md:hover:shadow-2xl md:hover:shadow-primary-light/20 md:hover:-translate-y-1 overflow-hidden"
              >
                <ProjectMedia mediaUrl={project.mediaUrl} title={project.title} />
                
                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{project.title}</h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark flex-grow mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map(tag => (
                    <span key={tag} className="bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-center font-semibold text-secondary-light dark:text-secondary-dark border border-secondary-light dark:border-secondary-dark rounded-full py-2 px-4 hover:bg-secondary-light dark:hover:bg-secondary-dark hover:text-white dark:hover:text-background-dark transition-all duration-300 z-10"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="min-h-[20vh] flex justify-center items-center">
            <p className="text-center text-text-secondary-light dark:text-text-secondary-dark text-lg">
              No projects found. Please add some from the admin panel.
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
});

export default Projects;