import React, { memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';
import { FaFilePdf } from 'react-icons/fa';

// =================================================================================
// Sub-component: ProjectMedia (FIXED with TypeError Guard)
// =================================================================================
const ProjectMedia = memo(({ mediaUrl, title }) => {

  const convertGoogleDriveUrl = (url) => {
    // FIX: Add a robust check to ensure 'url' is a string before calling .match()
    if (typeof url !== 'string' || !url) {
      return null;
    }
    
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };
  
  const displayUrl = convertGoogleDriveUrl(mediaUrl);

  if (!displayUrl) {
    return (
      <img
        loading="lazy"
        src={'https://placehold.co/600x400/e2e8f0/334155?text=Project'}
        alt={title}
        className="rounded-lg mb-4 aspect-video object-cover border border-primary-light/10 dark:border-primary-dark/20"
      />
    );
  }

  const isVideo = ['.mp4', '.webm', '.mov'].some(ext => displayUrl.toLowerCase().includes(ext));

  if (isVideo) {
    return (
      <video
        src={displayUrl}
        controls
        className="rounded-lg mb-4 aspect-video object-cover border border-primary-light/10 dark:border-primary-dark/20 w-full"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      loading="lazy"
      src={displayUrl}
      alt={title}
      className="rounded-lg mb-4 aspect-video object-cover border border-primary-light/10 dark:border-primary-dark/20 w-full"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/600x400/e2e8f0/334155?text=Media';
      }}
    />
  );
});


// =================================================================================
// Main Component: Projects (No changes needed here)
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
            className="grid grid-cols-1 md:give me the final code-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                variants={itemVariants}
                key={project.id}
                className="p-6 flex flex-col rounded-2xl bg-white dark:bg-background-alt-dark shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 border border-primary-light/10 dark:border-primary-dark/20 md:bg-white/20 md:dark:bg-slate-800/20 md:backdrop-blur-lg md:border-white/30 transition-all duration-300 md:hover:shadow-2xl md:hover:shadow-primary-light/20 md:hover:-translate-y-1 overflow-hidden"
              >
                <ProjectMedia 
                  mediaUrl={project.mediaUrls && project.mediaUrls.length > 0 ? project.mediaUrls[0] : null} 
                  title={project.title} 
                />
                
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