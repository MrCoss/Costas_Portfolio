// =================================================================================
// FILE: src/components/Achievements.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses the new semantic color tokens for a more
// consistent and maintainable dark mode implementation.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Achievements = React.memo(() => {
  return (
    <AnimatedSection id="achievements">
      {/* MODIFIED: Using new semantic text color tokens. */}
      <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">
        Key Achievements
      </h2>
      <AnimatedDivider />
      {/*
        MODIFIED: Using new semantic background colors and hover effects.
      */}
      <div className="relative p-8 md:p-12 max-w-4xl mx-auto rounded-2xl bg-white/20 dark:bg-background-dark/20 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/20 dark:hover:shadow-primary-dark/20 hover:-translate-y-1">
        {/* MODIFIED: Using new semantic text color tokens for the list. */}
        <ul className="space-y-4 text-lg text-text-primary-light/90 dark:text-text-primary-dark/90">
          {[
            { id: 1, text: "Completed <strong>60+ Certifications</strong> from IBM, Google, Meta, Microsoft, and Forage." },
            { id: 2, text: "Built and deployed <strong>25+ AI/Data/Full-stack projects</strong> solving real-world problems." },
            { id: 3, text: "Earned top-tier recognitions in job simulations at <strong>BCG, Lloyds, BA, EA, TATA</strong>, and more." },
            { id: 4, text: "Founded <strong>JHT SMART STEPS LEARNING</strong> – empowering students through digital education." }
          ].map(item => (
            <li key={item.id} className="flex items-start">
              {/* MODIFIED: Using new semantic color tokens for the checkmark icon. */}
              <span className="text-primary-light dark:text-primary-dark mr-3 mt-1 font-bold">&#10003;</span>
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
});

export default Achievements;