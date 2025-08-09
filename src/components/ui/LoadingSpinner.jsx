// =================================================================================
// FILE: src/components/ui/LoadingSpinner.jsx
// =================================================================================
// This component displays a custom, AI-themed loading animation using utilities
// from the centralized tailwind.config.js. This approach ensures maximum
// performance and maintainability. It is memoized to prevent re-renders.
// =================================================================================

import React from 'react';

const LoadingSpinner = React.memo(() => {
  return (
    // The main container, centering the spinner on the screen.
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
      <div className="relative w-24 h-24">
        {/*
          The central pulsing dot, representing a core or "brain".
          - It's centered using absolute positioning and translate utilities.
          - `animate-loading-pulse` applies the custom pulse animation.
        */}
        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full animate-loading-pulse"></div>

        {/*
          The orbiting rings, representing data or neural pathways.
          - Each ring is an absolutely positioned, full-sized div.
          - `border-2 border-transparent` creates the base for the ring.
          - `border-t-blue-600` gives the top part of the border color, creating the arc effect.
          - `animate-loading-spin` applies the custom spinning animation.
          - Arbitrary values `[animation-delay:-0.5s]` are a modern Tailwind feature used
            to offset the animations without needing extra config, creating a layered effect.
        */}
        <div className="absolute w-full h-full rounded-full border-2 border-transparent border-t-blue-600 animate-loading-spin"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-transparent border-t-blue-800 animate-loading-spin [animation-delay:-0.5s]"></div>
        <div className="absolute w-full h-full rounded-full border-2 border-transparent border-t-blue-400 animate-loading-spin [animation-delay:-1s]"></div>
      </div>
    </div>
  );
});

export default LoadingSpinner;
