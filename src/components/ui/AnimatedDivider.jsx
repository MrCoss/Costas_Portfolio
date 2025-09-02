// =================================================================================
// FILE: src/components/ui/AnimatedDivider.jsx
// =================================================================================
// This component renders a horizontal divider that animates into view when it
// becomes visible on the screen. It leverages the Framer Motion library for a
// smooth, physics-based animation and is memoized for optimal performance.
// =================================================================================

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedDivider = React.memo(() => {
  // Create a ref to attach to the component's root element. This allows us to
  // track its position and visibility in the viewport.
  const ref = useRef(null);

  // The useInView hook from Framer Motion returns `true` when the referenced
  // element enters the viewport.
  // - `once: true`: Ensures the animation only triggers a single time.
  // - `amount: 0.5`: Triggers the animation when 50% of the element is visible.
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Variants define the animation states for the motion component. This keeps
  // the animation logic clean and separate from the JSX.
  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1], // A custom ease-out cubic bezier for a snappy feel
      },
    },
  };

  return (
    // The outer div acts as the container and the trigger for the useInView hook.
    <div ref={ref} className="h-1 w-24 mx-auto my-8">
      <motion.div
        // UPDATED: The gradient is now 'primary' (emerald) to 'secondary' (pink).
        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        // The `transformOrigin` is set to 'center' to ensure the line scales
        // outwards from its middle point.
        style={{ transformOrigin: 'center' }}
        variants={dividerVariants}
        initial="hidden"
        // The `animate` prop dynamically changes to "visible" when `isInView` is true.
        animate={isInView ? 'visible' : 'hidden'}
      />
    </div>
  );
});

export default AnimatedDivider;