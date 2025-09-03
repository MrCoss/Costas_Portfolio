// =================================================================================
// FILE: src/components/ui/AnimatedSection.jsx (REFACTORED)
// =================================================================================
// This component now uses Framer Motion's `whileInView` prop for a cleaner,
// more declarative approach to scroll-triggered animations.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = React.memo(({ children, id, className = '' }) => {
  // Variants define the animation states, separating the animation logic from the JSX.
  const sectionVariants = {
    // The state before the element is in view: invisible and shifted down.
    hidden: { opacity: 0, y: 40 },
    // The state when the element is in view: fully visible and at its final position.
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0], // A standard ease-out curve for a natural feel.
      },
    },
  };

  return (
    <motion.section
      id={id}
      // Apply the defined variants.
      variants={sectionVariants}
      // Set the initial state to 'hidden'.
      initial="hidden"
      // REFACTORED: Use `whileInView` to automatically animate to the 'visible' state.
      whileInView="visible"
      // Configure the viewport trigger. This replaces `useInView`.
      viewport={{ once: true, amount: 0.2 }}
      // Combine default padding with any custom classes passed via props.
      className={`py-16 md:py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
});

export default AnimatedSection;