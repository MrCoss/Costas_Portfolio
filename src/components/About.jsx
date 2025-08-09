// =================================================================================
// FILE: src/components/About.jsx
// =================================================================================
// This component renders the "About Me" section of the portfolio. It has been
// refactored to use standard Tailwind CSS utilities for styling, including a
// modern glassmorphism effect, enhancing maintainability and visual appeal.
// It is memoized for optimal performance.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const About = React.memo(() => {
  return (
    <AnimatedSection id="about">
      <h2 className="text-4xl font-bold text-slate-700 text-center">
        About Me
      </h2>
      <AnimatedDivider />
      {/*
        This container creates the "glass card" effect using Tailwind utilities.
        - `bg-white/20`: A semi-transparent white background.
        - `backdrop-blur-lg`: Applies a blur to the content behind the card.
        - `border border-white/30`: A subtle border to define the card's edges.
        - `shadow-lg`: A soft base shadow for depth.
        - `transition-all duration-300`: Smooths out hover effects.
        - `hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1`: Creates a
          modern "glow" and lift effect on hover, replacing the old `glow-effect` div.
      */}
      <div className="relative p-8 md:p-12 max-w-4xl mx-auto rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
        <p className="text-lg leading-relaxed text-slate-600 text-center">
          As an MCA student at Manipal University, Jaipur, with a background in Computer Science, I am deeply immersed in the fields of data analytics and machine learning. My internship at SkillFied Mentor solidified my expertise in data exploration, visualization, and interpretation using key technologies like Python, Excel, and Power BI. I am passionate about making complex subjects accessible and have a proven track record of doing so as the founder of JHT SMART STEPS LEARNING. I am now eager to apply my analytical skills and technical knowledge to solve new challenges in the AI and ML industry.
        </p>
      </div>
    </AnimatedSection>
  );
});

export default About;
