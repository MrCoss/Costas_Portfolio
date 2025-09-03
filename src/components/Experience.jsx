// =================================================================================
// FILE: src/components/Experience.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses the new semantic color tokens for a more
// consistent and maintainable dark mode implementation.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: TimelineItem (Refactored for Semantic Dark Mode)
// =================================================================================
const TimelineItem = React.memo(({ date, title, company, details }) => (
  <motion.div
    whileHover={{ x: 5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    // MODIFIED: Use semantic border colors.
    className="relative pl-8 py-4 border-l-2 border-primary-light/20 dark:border-primary-dark/20"
  >
    {/* The circular marker on the timeline */}
    {/* MODIFIED: Marker now uses semantic theme colors. */}
    <div className="absolute -left-[11px] top-6 w-5 h-5 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full border-4 border-background-light dark:border-background-dark"></div>
    {/* MODIFIED: Text colors now use semantic names. */}
    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-1 font-medium">{date}</p>
    <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{title}</h3>
    <p className="text-lg text-primary-light dark:text-primary-dark font-semibold mb-3">{company}</p>
    <ul className="list-disc list-inside text-text-secondary-light dark:text-text-secondary-dark space-y-2">
      {details.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </motion.div>
));

// =================================================================================
// Main Component: Experience (Refactored for Semantic Dark Mode)
// =================================================================================
const Experience = React.memo(() => {
  const experiences = [
    {
      date: "Aug 2025 - Present",
      title: "Machine Learning Intern",
      company: "Unified Mentor (Remote)",
      details: [
        "Worked on AI-powered solutions and applied advanced ML algorithms to real-world challenges.",
        "Gained hands-on experience with Python, data preprocessing, and model development.",
        "Collaborated with industry professionals and received mentorship on best practices in AI/ML."
      ]
    },
    {
      date: "2024 - Present",
      title: "Data Analyst Intern",
      company: "SkillFied Mentor (Remote)",
      details: [
        "Collected, cleaned, and preprocessed datasets from diverse sources.",
        "Performed exploratory data analysis (EDA) using Python, Excel, and Power BI.",
        "Generated actionable insights to support internal strategy and client deliverables."
      ]
    },
    {
      date: "2022 - Present",
      title: "Founder",
      company: "JHT SMART STEPS LEARNING (On-site)",
      details: [
        "Leveraged technology to make education accessible and easy to understand.",
        "Created personalized lesson plans and educational resources for students.",
        "Tracked and assessed student progress, offering one-on-one coaching."
      ]
    }
  ];

  return (
    <AnimatedSection id="experience">
      {/* MODIFIED: Heading now uses semantic text color tokens. */}
      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Experience</h2>
      <AnimatedDivider />
      <div className="max-w-3xl mx-auto space-y-12">
        {experiences.map((exp, index) => (
          <TimelineItem key={index} {...exp} />
        ))}
      </div>
    </AnimatedSection>
  );
});

export default Experience;