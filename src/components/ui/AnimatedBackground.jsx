// =================================================================================
// FILE: src/components/ui/AnimatedBackground.jsx
// =================================================================================
// This component now creates a dynamic, multi-layered, and abstract background
// animation that is fully theme-aware for both light and dark modes.
// =================================================================================

import React from 'react';

const AnimatedBackground = React.memo(() => (
  // MODIFIED: The base background now uses the theme-aware colors.
  <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background-light dark:bg-background-dark">
    {/*
      MODIFIED: The primary gradient now uses theme-aware classes.
      It uses the new semantic names defined in tailwind.config.js
      (e.g., bg-radial-gradient-primary and dark:bg-radial-gradient-primary-dark).
    */}
    <div
      className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] bg-radial-gradient-primary dark:bg-radial-gradient-primary-dark animate-slow-spin"
    />
    {/*
      MODIFIED: The secondary gradient is also updated to be theme-aware.
      It uses the new semantic names for dark mode and an appropriate opacity
      for a seamless transition between themes.
    */}
    <div
      className="absolute top-1/2 left-1/2 w-[120vmax] h-[120vmax] bg-radial-gradient-secondary dark:bg-radial-gradient-secondary-dark animate-reverse-spin opacity-80"
    />
  </div>
));

export default AnimatedBackground;