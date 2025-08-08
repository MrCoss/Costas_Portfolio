// =================================================================================
// FILE: src/components/ui/AnimatedBackground.jsx
// =================================================================================
// This component creates a subtle, performant, and abstract background animation
// using pure CSS. It's designed to evoke a sense of data flow or neural
// network activity, fitting the AI/ML theme of the portfolio.
// It is memoized for performance.
// =================================================================================

import React from 'react';

const AnimatedBackground = React.memo(() => (
    // This div is fixed to the background and covers the entire viewport.
    // The -z-10 utility class ensures it stays behind all other content.
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#f5f7fa]">
        <style>{`
            /* * Defines the keyframes for the rotation animation.
             * It smoothly rotates the element 360 degrees.
             */
            @keyframes move {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }

            /* * Styles the element that will be animated. It's made oversized
             * (150vmax) to ensure it covers the screen even on large displays.
             * The background is composed of two soft radial gradients to create
             * an abstract, nebula-like effect.
             */
            .gradient-bg {
                width: 150vmax;
                height: 150vmax;
                position: absolute;
                top: 50%;
                left: 50%;
                background: radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 50%),
                            radial-gradient(circle, rgba(29, 78, 216, 0.1), transparent 60%);
                animation: move 25s linear infinite;
                opacity: 0.5;
            }
        `}</style>
        <div className="gradient-bg"></div>
    </div>
));

export default AnimatedBackground;