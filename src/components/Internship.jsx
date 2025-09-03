// =================================================================================
// FILE: src/components/Internships.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a consistent and fully semantic color palette
// for a seamless dark mode experience and a more maintainable structure.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: PdfViewerModal (Refactored for Semantic Dark Mode)
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
            // MODIFIED: Use semantic background colors.
            className="bg-background-light dark:bg-background-dark rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* MODIFIED: Header styles now use semantic color tokens. */}
            <header className="flex justify-between items-center p-4 border-b border-primary-light/10 dark:border-primary-dark/20">
              <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Internship Certificate</h3>
              <button
                onClick={onClose}
                // MODIFIED: Use semantic text and hover colors.
                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </header>
            {/* MODIFIED: Iframe container now uses semantic background colors. */}
            <div className="flex-grow p-2 bg-background-alt-light dark:bg-background-alt-dark">
              <iframe
                src={url}
                title="Internship Certificate PDF Viewer"
                className="w-full h-full border-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =================================================================================
// Main Component: Internships (Refactored for Semantic Dark Mode)
// =================================================================================
const Internships = React.memo(({ internshipsPdfUrl }) => {
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

  return (
    <>
      <AnimatedSection id="internships">
        {/* MODIFIED: Heading now uses semantic text color tokens. */}
        <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Internship Certificate</h2>
        <AnimatedDivider />
        <div className="text-center">
          <motion.button
            onClick={() => setViewingPdfUrl(internshipsPdfUrl)}
            disabled={!internshipsPdfUrl}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            // MODIFIED: Button styles now use semantic color tokens.
            className="inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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