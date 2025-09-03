// =================================================================================
// FILE: src/components/Internships.jsx (FINAL REFACTOR)
// =================================================================================
// This component now displays a single, multi-page PDF with an auto-scroll
// effect, providing a seamless viewing experience for a merged certificate.
// The component is now fully theme-aware with correct button text colors.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// The keyframe styles should be in your tailwind.config.js
// If they are not, this component will not work as expected.
const AutoScrollStyles = () => (
    <style>{`
        @keyframes auto-scroll {
            0% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(calc(-100% + 90vh));
            }
        }
        .animate-auto-scroll {
            animation: auto-scroll 60s linear infinite alternate;
        }
    `}</style>
);


// =================================================================================
// Sub-component: PdfViewerModal (Updated for Auto-Scroll)
// =================================================================================
const PdfViewerModal = ({ url, onClose }) => {
    return (
        <AnimatePresence>
            {url && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background-light dark:bg-background-dark rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
                    >
                        <header className="flex justify-between items-center p-4 border-b border-primary-light/10 dark:border-primary-dark/20">
                            <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Internship Certificate</h3>
                            <button
                                onClick={onClose}
                                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </header>
                        <div className="flex-grow p-2 bg-background-alt-light dark:bg-background-alt-dark overflow-hidden">
                            <iframe
                                src={url}
                                title="Internship Certificate PDF Viewer"
                                className="w-full h-full border-none animate-auto-scroll"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// =================================================================================
// Main Component: Internships (Updated)
// =================================================================================
const Internships = React.memo(() => {
    const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

    // The button classes have been defined here to ensure consistency.
    const buttonClasses = "inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <>
            <AutoScrollStyles />
            <AnimatedSection id="internships">
                <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Internship Certificate</h2>
                <AnimatedDivider />
                <div className="text-center">
                    <motion.button
                        onClick={() => setViewingPdfUrl("/internships/internships.pdf")}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={buttonClasses}
                    >
                        View Internship Certificate
                    </motion.button>
                </div>
            </AnimatedSection>

            <PdfViewerModal url={viewingPdfUrl} onClose={() => setViewingPdfUrl(null)} />
        </>
    );
});

export default Internships;
