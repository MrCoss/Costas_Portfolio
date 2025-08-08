// =================================================================================
// FILE: src/About.jsx
// =================================================================================
// This component renders the "About Me" section of the portfolio.
// It is memoized with React.memo to prevent unnecessary re-renders,
// improving overall application performance.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

const About = React.memo(() => {
  return (
    <AnimatedSection id="about">
      <h2 className="text-4xl font-bold text-[#334155] text-center">About Me</h2>
      <AnimatedDivider />
      <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
        {/* The glow effect adds a subtle, modern aesthetic on hover */}
        <div className="glow-effect"></div>
        <p className="text-lg leading-relaxed text-[#4b5563] text-center">
          As a current MCA student at Manipal University, Jaipur, with a Bachelor's in Computer Science, I am deeply engaged in the world of data analytics and machine learning. My internship at SkillFied Mentor provided a strong foundation in data exploration, visualization, and interpretation using tools like Python, Excel, and Power BI. I am passionate about leveraging technology to make complex subjects accessible, a skill I've honed as the founder of JHT SMART STEPS LEARNING. I am eager to apply my analytical skills to new challenges in the AI and ML space.
        </p>
      </div>
    </AnimatedSection>
  );
});

export default About;