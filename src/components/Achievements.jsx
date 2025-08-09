// =================================================================================
// FILE: src/components/Achievements.jsx
// =================================================================================
// This component displays a summary of key achievements using a modern, consistent
// glassmorphism effect. It is memoized for performance and refactored for
// maintainability with standard Tailwind CSS utilities.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Achievements = React.memo(() => {
  return (
    <AnimatedSection id="achievements">
      <h2 className="text-4xl font-bold text-slate-700 text-center">
        Key Achievements
      </h2>
      <AnimatedDivider />
      {/*
        This container uses the same "glass card" effect as the About section
        for visual consistency across the portfolio.
      */}
      <div className="relative p-8 md:p-12 max-w-4xl mx-auto rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
        <ul className="space-y-4 text-lg text-slate-600">
          {[
            { id: 1, text: "Completed <strong>60+ Certifications</strong> from IBM, Google, Meta, Microsoft, and Forage." },
            { id: 2, text: "Built and deployed <strong>25+ AI/Data/Full-stack projects</strong> solving real-world problems." },
            { id: 3, text: "Earned top-tier recognitions in job simulations at <strong>BCG, Lloyds, BA, EA, TATA</strong>, and more." },
            { id: 4, text: "Founded <strong>JHT SMART STEPS LEARNING</strong> – empowering students through digital education." }
          ].map(item => (
            <li key={item.id} className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">&#10003;</span>
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
});

export default Achievements;
