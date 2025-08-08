// =================================================================================
// FILE: src/components/ui/LoadingSpinner.jsx
// =================================================================================
// This component displays a custom, AI-themed loading animation. It is shown
// while the initial data for the portfolio is being fetched from Firebase.
// The animation is created with pure CSS for maximum performance.
// It is memoized to prevent unnecessary re-renders.
// =================================================================================

import React from 'react';

const LoadingSpinner = React.memo(() => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
      <div className="relative w-24 h-24">
        <style>{`
          /* Defines the main spinning animation for the rings */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Defines the pulsing animation for the central dot */
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; }
          }

          /* Base styles for the orbiting rings */
          .orb {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: #2563eb; /* Primary blue color */
            animation: spin 1.5s linear infinite;
          }

          /* Second ring with a delayed animation and different color */
          .orb-2 {
            animation-delay: -0.5s;
            border-top-color: #1e3a8a; /* Darker blue */
          }

          /* Third ring with another delay and color for a layered effect */
          .orb-3 {
            animation-delay: -1s;
            border-top-color: #60a5fa; /* Lighter blue */
          }

          /* The central pulsing dot */
          .dot {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #2563eb;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            margin: -5px 0 0 -5px; /* Center the dot perfectly */
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
        <div className="orb"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
});

export default LoadingSpinner;
