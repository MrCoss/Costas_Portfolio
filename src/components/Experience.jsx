// =================================================================================
// FILE: src/components/Experience.jsx
// =================================================================================
// This component renders the professional experience section using a vertical
// timeline format. It is composed of reusable, memoized sub-components for
// optimal performance and maintainability.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: TimelineItem
// Displays a single entry in the experience timeline with consistent styling.
// =================================================================================
const TimelineItem = React.memo(({ date, title, company, details }) => (
  <motion.div
    whileHover={{ x: 5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="relative pl-8 py-4 border-l-2 border-indigo-200"
  >
    {/* The circular marker on the timeline */}
    <div className="absolute -left-[11px] top-6 w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full border-4 border-white"></div>
    <p className="text-slate-500 mb-1 font-medium">{date}</p>
    <h3 className="text-2xl font-bold text-slate-700">{title}</h3>
    <p className="text-lg text-blue-600 font-semibold mb-3">{company}</p>
    <ul className="list-disc list-inside text-slate-600 space-y-2">
      {details.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  </motion.div>
));

// =================================================================================
// Main Component: Experience
// Assembles the timeline by mapping over experience data.
// =================================================================================
const Experience = React.memo(() => {
  const experiences = [
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
      <h2 className="text-4xl font-bold text-slate-700 text-center">Experience</h2>
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
