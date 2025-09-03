// =================================================================================
// FILE: src/components/ui/LoadingSpinner.jsx (FINAL REFACTOR)
// =================================================================================
// This component displays a custom, "Newton's Cradle" style loading animation
// that is now fully theme-aware and will adapt its colors for both
// light and dark modes.
// =================================================================================

import React from 'react';

const LoadingSpinner = React.memo(() => {
  // A reusable component for each animated dot.
  const Dot = ({ delay }) => (
    // MODIFIED: The gradient now uses semantic, theme-aware color tokens.
    <div
      className="w-4 h-4 bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-full animate-pulse-bounce"
      style={{ animationDelay: delay }}
    />
  );

  return (
    // MODIFIED: The main container's background color uses the new semantic tokens.
    <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
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