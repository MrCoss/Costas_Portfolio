// =================================================================================
// FILE: src/components/Skills.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a consistent and fully semantic color palette
// for a seamless dark mode experience and a more maintainable structure.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaChartBar, FaReact, FaBrain, FaTools, FaChevronDown } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Skills = React.memo(() => {
  const [openCategory, setOpenCategory] = useState('Programming Languages');

  const handleToggle = (category) => {
    setOpenCategory(prevCategory => (prevCategory === category ? null : category));
  };

  const categorizedSkills = {
    'Programming Languages': [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'Java', level: 75 },
      { name: 'SQL', level: 80 },
    ],
    'Data Science & Analytics': [
      { name: 'Data Analysis', level: 90 },
      { name: 'Machine Learning', level: 75 },
      { name: 'Power BI', level: 85 },
      { name: 'Excel', level: 95 },
    ],
    'Web & App Development': [
      { name: 'React', level: 85 },
      { name: 'Firebase', level: 80 },
      { name: 'Tailwind CSS', level: 80 },
      { name: 'Streamlit', level: 75 },
    ],
    'AI & Generative AI': [
      { name: 'Generative AI Concepts', level: 85 },
      { name: 'Prompt Engineering', level: 90 },
      { name: 'LangChain', level: 75 },
    ],
    'Tools & Workflow': [
      { name: 'Git & GitHub', level: 95 },
      { name: 'Version Control', level: 90 },
    ]
  };

  // MODIFIED: Icons now have semantic color variants.
  const categoryIcons = {
    'Programming Languages': <FaCode className="mr-3 text-primary-light dark:text-primary-dark" />,
    'Data Science & Analytics': <FaChartBar className="mr-3 text-primary-light dark:text-primary-dark" />,
    'Web & App Development': <FaReact className="mr-3 text-secondary-light dark:text-secondary-dark" />,
    'AI & Generative AI': <FaBrain className="mr-3 text-primary-light dark:text-primary-dark" />,
    'Tools & Workflow': <FaTools className="mr-3 text-text-secondary-light dark:text-text-secondary-dark" />,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="skills">
      {/* MODIFIED: Heading now uses semantic text colors. */}
      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">My Skills</h2>
      <AnimatedDivider />
      {/* MODIFIED: Glass card now uses semantic colors and hover effects. */}
      <div className="relative p-4 md:p-8 max-w-4xl mx-auto rounded-2xl bg-white/20 dark:bg-background-alt-dark/20 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-lg dark:shadow-2xl dark:shadow-primary-dark/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/20 dark:hover:shadow-primary-dark/20 hover:-translate-y-1">
        <div className="space-y-2">
          {Object.entries(categorizedSkills).map(([category, skills]) => (
            // MODIFIED: Border color now uses semantic names.
            <div key={category} className="border-b border-primary-light/20 dark:border-primary-dark/20 last:border-b-0">
              <button
                onClick={() => handleToggle(category)}
                // MODIFIED: Text color now uses semantic names.
                className="w-full flex justify-between items-center py-4 text-left text-xl font-semibold text-text-primary-light dark:text-text-primary-dark focus:outline-none"
              >
                <span className="flex items-center">
                  {categoryIcons[category]}
                  {category}
                </span>
                <motion.span animate={{ rotate: openCategory === category ? 180 : 0 }}>
                  {/* MODIFIED: Chevron icon now uses semantic text colors. */}
                  <FaChevronDown className="w-5 h-5 transition-colors duration-300 text-text-secondary-light dark:text-text-secondary-dark" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openCategory === category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2 pb-6 px-2"
                    >
                      {skills.map((skill) => (
                        <motion.div variants={itemVariants} key={skill.name}>
                          {/* MODIFIED: Skill name now uses semantic text colors. */}
                          <p className="text-lg font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">{skill.name}</p>
                          {/* MODIFIED: Progress bar background and gradient now use semantic names. */}
                          <div className="bg-primary-light/10 dark:bg-primary-dark/10 w-full rounded-full h-2.5">
                            <motion.div
                              className="h-2.5 rounded-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
});

export default Skills;