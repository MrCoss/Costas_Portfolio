// =================================================================================
// FILE: src/components/Skills.jsx
// =================================================================================
// This component displays technical skills in an interactive accordion format.
// It allows users to click on a category to reveal the skills within,
// creating a clean and engaging user experience. It is memoized for performance.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Skills = React.memo(() => {
  // State to manage which category is currently open. Default to the first.
  const [openCategory, setOpenCategory] = useState('Programming Languages');

  // Toggles the accordion. If the clicked category is already open, it closes it.
  const handleToggle = (category) => {
    setOpenCategory(prevCategory => (prevCategory === category ? null : category));
  };

  // Data structure for skills, organized by category with proficiency levels.
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

  // Animation variants for staggering the skill items' entrance.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AnimatedSection id="skills">
      <h2 className="text-4xl font-bold text-slate-700 text-center">My Skills</h2>
      <AnimatedDivider />
      {/* This container provides the consistent "glass card" effect. */}
      <div className="relative p-4 md:p-8 max-w-4xl mx-auto rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
        <div className="space-y-2">
          {Object.entries(categorizedSkills).map(([category, skills]) => (
            <div key={category} className="border-b border-slate-300/50 last:border-b-0">
              <button
                onClick={() => handleToggle(category)}
                className="w-full flex justify-between items-center py-4 text-left text-xl font-semibold text-slate-700 focus:outline-none"
              >
                <span>{category}</span>
                <motion.span animate={{ rotate: openCategory === category ? 180 : 0 }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
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
                          <p className="text-lg font-medium text-slate-600 mb-1">{skill.name}</p>
                          <div className="bg-slate-300 w-full rounded-full h-2.5">
                            <motion.div
                              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
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
