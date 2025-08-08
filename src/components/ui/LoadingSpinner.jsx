// =================================================================================
// FILE: src/components/ui/LoadingSpinner.jsx
// =================================================================================
// This component displays a custom, AI-themed loading animation. It is shown
// while the initial data for the portfolio is being fetched from Firebase.
// The SVG animation is lightweight and styled to match the site's aesthetic.
// It is memoized for performance.
// =================================================================================

import React from 'react';

const LoadingSpinner = React.memo(() => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
      <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#1e3a8a">
        {/* The animation styles are embedded directly in the SVG for simplicity */}
        <style>{`
          .spinner_V8m1 {
            transform-origin: center;
            animation: spinner_zKoa 2s linear infinite;
          }
          .spinner_zKoa {
            animation-timing-function: steps(8, end);
          }
          @keyframes spinner_zKoa {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <g className="spinner_V8m1">
          <rect x="47" y="24" width="6" height="12" rx="3"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(45 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(90 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(135 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(180 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(225 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(270 50 50)"></rect>
          <rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(315 50 50)"></rect>
        </g>
      </svg>
    </div>
  );
});

export default LoadingSpinner;