import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: SlideshowModal (with TypeError fix)
// =================================================================================
const SlideshowModal = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const convertGoogleDriveUrl = (url) => {
    // FIX: Add a robust check to ensure 'url' is a string before calling .match()
    if (typeof url !== 'string' || !url) {
      return null;
    }
    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentImageUrl = convertGoogleDriveUrl(images[currentIndex]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-20 text-white bg-black/50 rounded-full p-2 hover:bg-red-500 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
             {isLoading && <div className="text-white">Loading image...</div>}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={currentImageUrl || ''} // Use empty string fallback for src
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl ${isLoading || !currentImageUrl ? 'hidden' : 'block'}`}
                alt={`Slide ${currentIndex + 1}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </AnimatePresence>
          </div>
          
          <button onClick={goToPrevious} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition-colors focus:outline-none">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={goToNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path></svg>
          </button>

          <div className="absolute bottom-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// =================================================================================
// Main Component: Certifications (No changes needed here)
// =================================================================================
const Certifications = React.memo(({ licensesImageUrls, internshipsImageUrls }) => {
  const [activeSlideshow, setActiveSlideshow] = useState({
      isOpen: false,
      images: [],
  });

  const openSlideshow = (images) => {
    if (images && images.length > 0) {
        setActiveSlideshow({ isOpen: true, images: images });
    }
  };

  const closeSlideshow = () => {
    setActiveSlideshow({ isOpen: false, images: [] });
  };

  const hasLicenses = licensesImageUrls && licensesImageUrls.length > 0;
  const hasInternships = internshipsImageUrls && internshipsImageUrls.length > 0;

  return (
    <>
      <AnimatedSection id="certifications">
        <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Certificates & Internships</h2>
        <AnimatedDivider />
        <p className="text-center text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-2xl mx-auto">
          Click below to view a slideshow of my professional licenses, certifications, and internship completion letters.
        </p>
        <div className="text-center flex flex-col md:flex-row justify-center items-center gap-6">
          <motion.button
            onClick={() => openSlideshow(licensesImageUrls)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={!hasLicenses}
            className="inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Licenses & Certs
          </motion.button>
          <motion.button
            onClick={() => openSlideshow(internshipsImageUrls)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={!hasInternships}
            className="inline-block text-white dark:text-text-primary-dark font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-primary-light/30 dark:shadow-primary-dark/30 bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Internship Certs
          </motion.button>
        </div>
      </AnimatedSection>

      {activeSlideshow.isOpen && (
        <SlideshowModal 
          images={activeSlideshow.images}
          onClose={closeSlideshow} 
        />
      )}
    </>
  );
});

export default Certifications;