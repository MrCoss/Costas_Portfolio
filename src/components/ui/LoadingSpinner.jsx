// =================================================================================
// FILE: src/components/ui/LoadingSpinner.jsx
// =================================================================================
// This component displays a custom, "Newton's Cradle" style loading animation
// using utilities from the centralized tailwind.config.js. This approach ensures
// maximum performance and maintainability. It is memoized to prevent re-renders.
// =================================================================================

import React from 'react';

const LoadingSpinner = React.memo(() => {
  // A reusable component for each animated dot.
  const Dot = ({ delay }) => (
    <div
      // UPDATED: Gradient changed from blue to the primary (emerald) and secondary (pink) theme colors.
      className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse-bounce"
      style={{ animationDelay: delay }}
    />
  );

  return (
    // The main container, centering the spinner on the screen.
    // UPDATED: Background color changed to the theme's 'bg-background' (white).
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="flex items-center justify-center space-x-2">
        {/* Render multiple dots with staggered animation delays */}
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </div>
    </div>
  );
});

export default LoadingSpinner;