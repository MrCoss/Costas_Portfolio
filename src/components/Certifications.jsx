// =================================================================================
// FILE: src/components/Certifications.jsx
// =================================================================================
// This component displays links to view PDF versions of licenses and internship
// certificates. It is memoized for performance and includes hover animations.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedDivider } from './ui'; // Imports reusable UI components

const Certifications = React.memo(({ licensesPdfUrl, internshipsPdfUrl }) => {
  return (
    <AnimatedSection id="certifications">
      <h2 className="text-4xl font-bold text-[#334155] text-center">Certificates</h2>
      <AnimatedDivider />
      <div className="text-center flex flex-col md:flex-row justify-center items-center gap-6">
        <motion.a
          href={licensesPdfUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-[#2563eb]/20 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] ${!licensesPdfUrl && 'opacity-50 cursor-not-allowed'}`}
        >
          View Licenses & Certs
        </motion.a>
        <motion.a
          href={internshipsPdfUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-[#2563eb]/20 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] ${!internshipsPdfUrl && 'opacity-50 cursor-not-allowed'}`}
        >
          View Internship Certs
        </motion.a>
      </div>
    </AnimatedSection>
  );
});

export default Certifications;