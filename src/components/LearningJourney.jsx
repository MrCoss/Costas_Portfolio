// =================================================================================
// FILE: src/components/LearningJourney.jsx
// =================================================================================
// This component outlines the educational and self-learning milestones.
// It is memoized for performance and uses the standard animated reveal effect.
// =================================================================================

import React from 'react';
import { AnimatedSection, AnimatedDivider } from './ui'; // Imports reusable UI components

const LearningJourney = React.memo(() => {
  return (
    <AnimatedSection id="journey">
      <h2 className="text-4xl font-bold text-[#334155] text-center">My Learning Journey</h2>
      <AnimatedDivider />
      <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
        <div className="glow-effect"></div>
        <p className="text-lg text-center text-[#4b5563] mb-6">From mastering foundational concepts to building AI-powered solutions, my journey is marked by continuous growth:</p>
        <ul className="list-disc list-inside text-[#4b5563] space-y-3 text-lg mx-auto max-w-2xl">
          <li>
            <strong>2023:</strong> Dived into foundational programming with Python and Java, while building a strong understanding of front-end development and creating my first machine learning models.
          </li>
          <li>
            <strong>2024:</strong> Accelerated my learning by completing over 60 certifications in AI, Data Science, UX Design, and Full-Stack Development from industry leaders.
          </li>
          <li>
            <strong>Ongoing:</strong> Actively applying knowledge through daily practice on real-world challenges, contributing to GitHub repositories, and gaining practical experience via internships.
          </li>
        </ul>
      </div>
    </AnimatedSection>
  );
});

export default LearningJourney;