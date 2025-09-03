// =================================================================================
// FILE: src/components/Certifications.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a professional PDF viewer for a clean,
// page-by-page slideshow experience. It handles both licenses/certs
// and internships within a single, consistent interface.
// The necessary CSS for the PDF viewer has been embedded using a CDN link
// to prevent build errors.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';
// NOTE: The direct import statements below cause issues with Vite.
// We will use CDN links instead, as previously implemented.
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewerStyles = () => (
    <>
      <link rel="stylesheet" href="https://unpkg.com/react-pdf@5.7.2/dist/esm/Page/AnnotationLayer.css" />
      <link rel="stylesheet" href="https://unpkg.com/react-pdf@5.7.2/dist/esm/Page/TextLayer.css" />
    </>
);

// =================================================================================
// Sub-component: PdfViewerModal
// =================================================================================
const PdfViewerModal = ({ url, onClose }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const goToPrevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));

    const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5));

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
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={zoomOut}
                                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                                    aria-label="Zoom Out"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12H3"></path></svg>
                                </button>
                                <span className="text-text-secondary-light dark:text-text-secondary-dark">{`${Math.round(scale * 100)}%`}</span>
                                <button
                                    onClick={zoomIn}
                                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                                    aria-label="Zoom In"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors p-1 rounded-full hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/10"
                                    aria-label="Close"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </header>
                        <div className="flex-grow flex items-center justify-center p-2 bg-background-alt-light dark:bg-background-alt-dark">
                            <Document
                                file={url}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page pageNumber={pageNumber} scale={scale} />
                            </Document>
                        </div>
                        {numPages > 1 && (
                            <div className="flex justify-center items-center py-4 space-x-4 border-t border-primary-light/10 dark:border-primary-dark/20">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    className="text-text-primary-light dark:text-text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <span className="text-text-secondary-light dark:text-text-secondary-dark font-mono">{`Page ${pageNumber} of ${numPages}`}</span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="text-text-primary-light dark:text-text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        )}
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
            <PdfViewerStyles />
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