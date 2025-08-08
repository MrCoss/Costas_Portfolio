// =================================================================================
// FILE: src/Achievements.jsx
// =================================================================================
// This component displays a summary of key achievements in a glass-card format.
// It is memoized with React.memo for performance optimization, preventing
// re-renders unless its props change.
// =================================================================================

import React from 'react';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

const Achievements = React.memo(() => {
  return (
    <AnimatedSection id="achievements">
      <h2 className="text-4xl font-bold text-[#334155] text-center">Key Achievements</h2>
      <AnimatedDivider />
      <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
        {/* The glow effect adds a subtle, modern aesthetic on hover */}
        <div className="glow-effect"></div>
        <ul className="list-disc list-inside text-[#4b5563] space-y-3 text-lg">
          <li>Completed <strong>60+ Certifications</strong> from IBM, Google, Meta, Microsoft, and Forage.</li>
          <li>Built and deployed <strong>25+ AI/Data/Full-stack projects</strong> solving real-world problems.</li>
          <li>Earned top-tier recognitions in job simulations at <strong>BCG, Lloyds, BA, EA, TATA</strong>, and more.</li>
          <li>Founded <strong>JHT SMART STEPS LEARNING</strong> – empowering students through digital education.</li>
        </ul>
      </div>
    </AnimatedSection>
  );
});

export default Achievements;