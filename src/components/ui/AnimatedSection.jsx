// =================================================================================
// FILE: src/components/ui/AnimatedSection.jsx
// =================================================================================
// This is a reusable wrapper component that applies a consistent "fade and slide up"
// animation to any section as it scrolls into the user's viewport. It uses
// Framer Motion for efficient, physics-based animations and is memoized for
// optimal performance.
// =================================================================================

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedSection = React.memo(({ children, id, className = '' }) => {
  // A ref to attach to the section element to track its position on the page.
  const ref = useRef(null);

  // The useInView hook returns `true` when the referenced element is in view.
  // - `once: true`: Ensures the animation only triggers once.
  // - `amount: 0.2`: Starts the animation when 20% of the section is visible,
  //   providing a smoother lead-in.
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Variants define the animation states, separating the animation logic from the JSX
  // for better readability and maintenance.
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
      ref={ref}
      // Apply the defined variants.
      variants={sectionVariants}
      // Set the initial state to 'hidden'.
      initial="hidden"
      // Dynamically animate to the 'visible' state when `isInView` becomes true.
      animate={isInView ? 'visible' : 'hidden'}
      // Combine default padding with any custom classes passed via props.
      className={`py-16 md:py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
});

export default AnimatedSection;
