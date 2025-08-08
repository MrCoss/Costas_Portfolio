// =================================================================================
// FILE: src/components/ui/AnimatedDivider.jsx
// =================================================================================
// This component renders a simple horizontal divider line that animates into
// view when it becomes visible on the screen. It is used to visually separate
// section titles from their content. It is memoized for performance.
// =================================================================================

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedDivider = React.memo(() => {
  // A ref to attach to the element for tracking its visibility
  const ref = useRef(null);
  
  // useInView hook from Framer Motion tracks when the element enters the viewport.
  // 'once: true' ensures the animation only runs one time.
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="h-1 w-24 mx-auto my-8">
      <motion.div
        className="h-full bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] rounded-full"
        // The animation starts with a scaleX of 0 (invisible)
        initial={{ scaleX: 0 }}
        // When in view, it animates to a scaleX of 1 (fully visible)
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        // Ensures the line grows from the center
        style={{ transformOrigin: 'center' }}
      />
    </div>
  );
});

export default AnimatedDivider;