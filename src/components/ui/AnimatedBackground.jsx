// =================================================================================
// FILE: src/components/ui/AnimatedBackground.jsx
// =================================================================================
// This component creates a dynamic, multi-layered, and abstract background
// animation. It uses custom utilities defined in the tailwind.config.js file
// to create a sense of depth and motion, evoking data flows or cosmic nebulae.
// It is memoized for performance.
// =================================================================================

import React from 'react';

const AnimatedBackground = React.memo(() => (
    // This div is fixed to the background, covers the entire viewport, and is
    // placed behind all other content using -z-10.
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#f5f7fa]">
        {/*
          This is the primary, larger animated gradient.
          - It uses `animate-spin-pulse-combo`, a custom utility that combines
            a slow rotation and a soft pulse into a single, conflict-free animation.
          - The gradient is defined by `bg-radial-gradient-blue`.
        */}
        <div
            className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] bg-radial-gradient-blue animate-spin-pulse-combo"
        />
        {/*
          This is the secondary, smaller animated gradient that adds depth.
          - It's slightly smaller (`w-[120vmax]`) to layer behind the primary one.
          - It uses `reverse-spin` to rotate in the opposite direction, creating a parallax effect.
          - The `bg-radial-gradient-purple` provides a subtle color variation.
          - A base opacity is applied to blend it smoothly.
        */}
        <div
            className="absolute top-1/2 left-1/2 w-[120vmax] h-[120vmax] bg-radial-gradient-purple animate-reverse-spin opacity-40"
        />
    </div>
));

export default AnimatedBackground;
