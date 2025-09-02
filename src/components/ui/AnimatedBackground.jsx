// =================================================================================
// FILE: src/components/ui/AnimatedBackground.jsx
// =================================================================================
// This component creates a dynamic, multi-layered, and abstract background
// animation. It uses custom utilities defined in the tailwind.config.js file
// to create a sense of depth and motion with a soft, elegant glow.
// It is memoized for performance.
// =================================================================================

import React from 'react';

const AnimatedBackground = React.memo(() => (
    // UPDATED: The base background is now 'bg-background' (white) for a clean look.
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background">
        {/*
          This is the primary, larger animated gradient.
          - It uses `animate-spin-pulse-combo` for a slow, pulsing rotation.
          - UPDATED: The gradient is now 'bg-radial-gradient-emerald' for a soft green glow.
        */}
        <div
            className="absolute top-1/2 left-1/2 w-[150vmax] h-[150vmax] bg-radial-gradient-emerald animate-spin-pulse-combo"
        />
        {/*
          This is the secondary, smaller animated gradient that adds depth.
          - It uses `reverse-spin` to rotate in the opposite direction.
          - UPDATED: The gradient is now 'bg-radial-gradient-pink' for a complementary accent.
          - UPDATED: Opacity is adjusted to blend smoothly against the white background.
        */}
        <div
            className="absolute top-1/2 left-1/2 w-[120vmax] h-[120vmax] bg-radial-gradient-pink animate-reverse-spin opacity-60"
        />
    </div>
));

export default AnimatedBackground;