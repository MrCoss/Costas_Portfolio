// =================================================================================
// FILE: src/components/Certifications.jsx (FINAL)
// =================================================================================
// This component now uses a simple and reliable iframe with Google Docs Viewer
// to display PDFs.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: PdfViewerModal
// =================================================================================
const PdfViewerModal = ({ url, onClose }) => {
    // Return null if no valid URL is provided to prevent the modal from opening blankly.
    if (!url) {
        return null;
    }

    // Construct the Google Docs Viewer URL for embedding.
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <AnimatePresence>
            {url && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background-light dark:bg-background-dark rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative"
                    >
                        <header className="flex justify-between items-center p-4 border-b border-primary-light/10 dark:border-primary-dark/20">
                            <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Certificate Viewer</h3>
                            <button
                                onClick={onClose}
                                className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </header>
                        
                        <div className="flex-grow">
                            <iframe 
                                src={googleViewerUrl}
                                title="PDF Viewer"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                            ></iframe>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// =================================================================================
// Main Component: Certifications
// =================================================================================
const Certifications = React.memo(({ licensesPdfUrl, internshipsPdfUrl }) => {
    const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

    const openLicsAndCerts = () => setViewingPdfUrl(licensesPdfUrl);
    const openInternships = () => setViewingPdfUrl(internshipsPdfUrl);
    const closePdfViewer = () => setViewingPdfUrl(null);

    return (
        <>
            <AnimatedSection id="certifications">
                <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Certificates & Internships</h2>
                <AnimatedDivider />
                <div className="text-center flex flex-col md:flex-row justify-center items-center gap-6">
                    <motion.button
                        onClick={openLicsAndCerts}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300"
                    >
                        View Licenses & Certs
                    </motion.button>
                    <motion.button
                        onClick={openInternships}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300"
                    >
                        View Internship Certs
                    </motion.button>
                </div>
            </AnimatedSection>
            <PdfViewerModal url={viewingPdfUrl} onClose={closePdfViewer} />
        </>
    );
});

export default Certifications;