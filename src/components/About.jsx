// =================================================================================
// FILE: src/components/About.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses the new semantic color tokens for a more
// consistent and maintainable dark mode implementation.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const About = React.memo(() => {
  return (
    <AnimatedSection id="about">
      {/* MODIFIED: Using new semantic text color tokens. */}
      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
        About Me
      </h2>
      <AnimatedDivider />
      {/*
        MODIFIED: Using new semantic background colors and hover effects.
      */}
      <div className="relative p-8 md:p-12 max-w-4xl mx-auto rounded-2xl bg-white/20 dark:bg-background-dark/20 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/20 dark:hover:shadow-primary-dark/20 hover:-translate-y-1">
        {/* MODIFIED: Using new semantic text color tokens for the paragraph. */}
        <p className="text-lg leading-relaxed text-text-primary-light/90 dark:text-text-primary-dark/90 text-center">
          As an MCA student at Manipal University, Jaipur, with a background in Computer Science, I am deeply immersed in the fields of data analytics and machine learning. My internship at SkillFied Mentor solidified my expertise in data exploration, visualization, and interpretation using key technologies like Python, Excel, and Power BI. I am passionate about making complex subjects accessible and have a proven track record of doing so as the founder of JHT SMART STEPS LEARNING. I am now eager to apply my analytical skills and technical knowledge to solve new challenges in the AI and ML industry.
        </p>
      </div>
    </AnimatedSection>
  );
});

export default About;