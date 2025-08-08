// =================================================================================
// FILE: src/Internships.jsx
// =================================================================================
// This component displays a link to open a modal and view the internship
// certificate PDF. It is a focused version of the Certifications component.
// =================================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

// The PDF viewer modal sub-component
const PdfViewerModal = ({ url, onClose }) => {
  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg text-gray-700">Internship Certificate</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-grow p-2">
              <iframe
                src={url}
                title="Internship Certificate PDF Viewer"
                width="100%"
                height="100%"
                className="border-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Internships = React.memo(({ internshipsPdfUrl }) => {
  // State to manage the modal's visibility
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null);

  return (
    <>
      <AnimatedSection id="internships">
        <h2 className="text-4xl font-bold text-[#334155] text-center">Internship Certificate</h2>
        <AnimatedDivider />
        <div className="text-center">
          <motion.button
            onClick={() => setViewingPdfUrl(internshipsPdfUrl)}
            disabled={!internshipsPdfUrl}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-[#2563eb]/20 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] ${!internshipsPdfUrl && 'opacity-50 cursor-not-allowed'}`}
          >
            View Internship Certificate
          </motion.button>
        </div>
      </AnimatedSection>

      {/* The Modal component is rendered here */}
      <PdfViewerModal url={viewingPdfUrl} onClose={() => setViewingPdfUrl(null)} />
    </>
  );
});

export default Internships;