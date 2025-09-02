// =================================================================================
// FILE: src/components/Certifications.jsx
// =================================================================================
// This component displays links that open a modal to view PDFs of certificates.
// It uses a state to manage the visibility of the modal and which PDF to display,
// creating a seamless, in-page viewing experience with smooth animations.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: PdfViewerModal
// A self-contained, animated modal for displaying PDF content within an iframe.
// =================================================================================
const PdfViewerModal = ({ url, onClose }) => {
  // The `AnimatePresence` component from Framer Motion enables the exit animation
  // when the modal is removed from the React tree.
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
            // Prevents the modal from closing when its interior is clicked.
            onClick={(e) => e.stopPropagation()}
            // UPDATED: Modal background uses the theme's 'bg-background'.
            className="bg-background rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* UPDATED: Header styles updated to match the theme. */}
            <header className="flex justify-between items-center p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg text-text-primary">Certificate Viewer</h3>
              <button
                onClick={onClose}
                // UPDATED: Close button now uses theme colors for a consistent look.
                className="text-text-secondary hover:text-secondary transition-colors p-1 rounded-full hover:bg-secondary/10"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </header>
            {/* UPDATED: Iframe container background uses the theme's alternate background. */}
            <div className="flex-grow p-2 bg-background-alt">
              <iframe
                src={url}
                title="Certificate PDF Viewer"
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
// Main Component: Certifications
// Renders the section and handles the state for the PDF viewer modal.
// =================================================================================
const Certifications = React.memo(({ licensesPdfUrl, internshipsPdfUrl }) => {
  // State to hold the URL of the PDF to be displayed in the modal.
  // `null` means the modal is hidden.
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

  // UPDATED: Button styles now use the primary (emerald) and secondary (pink) theme colors.
  const buttonClasses = "inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <AnimatedSection id="certifications">
        {/* UPDATED: Heading text color now uses text-primary. */}
        <h2 className="text-4xl font-bold text-text-primary text-center">Certificates</h2>
        <AnimatedDivider />
        <div className="text-center flex flex-col md:flex-row justify-center items-center gap-6">
          <motion.button
            onClick={() => setViewingPdfUrl(licensesPdfUrl)}
            disabled={!licensesPdfUrl}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClasses}
          >
            View Licenses & Certs
          </motion.button>
          <motion.button
            onClick={() => setViewingPdfUrl(internshipsPdfUrl)}
            disabled={!internshipsPdfUrl}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={buttonClasses}
          >
            View Internship Certs
          </motion.button>
        </div>
      </AnimatedSection>

      {/* The Modal component is rendered here and its visibility is controlled by `viewingPdfUrl` */}
      <PdfViewerModal url={viewingPdfUrl} onClose={() => setViewingPdfUrl(null)} />
    </>
  );
});

export default Certifications;