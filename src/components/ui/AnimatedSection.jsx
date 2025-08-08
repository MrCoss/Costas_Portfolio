// =================================================================================
// FILE: src/components/ui/AnimatedSection.jsx
// =================================================================================
// This is a reusable wrapper component that applies a consistent "fade and slide up"
// animation to any section as it scrolls into the user's viewport. It uses the
// useInView hook from Framer Motion for efficient visibility tracking.
// It is memoized for performance.
// =================================================================================

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedSection = React.memo(({ children, id, className = '' }) => {
  // A ref to attach to the section element to track its position on the page.
  const ref = useRef(null);
  
  // The useInView hook returns `true` when the referenced element is in the viewport.
  // `once: true` ensures the animation only triggers once.
  // `amount: 0.2` means the animation will start when 20% of the section is visible.
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      id={id}
      ref={ref}
      // Initial animation state: invisible and slightly moved down.
      initial={{ opacity: 0, y: 50 }}
      // Animate to: fully visible and at its original position when in view.
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-12 md:py-16 ${className}`}
    >
      {children}
    </motion.section>
  );
});

export default AnimatedSection;