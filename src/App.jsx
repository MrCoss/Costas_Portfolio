// =================================================================================
// FILE: src/App.jsx
// =================================================================================
// This is the root component of the portfolio application. It orchestrates the
// entire application by handling Firebase initialization, data fetching, routing,
// and rendering all the main sections and pages. It now includes an ErrorBoundary
// for improved application stability.
// =================================================================================

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { LazyMotion, domAnimation } from 'framer-motion';

// --- COMPONENT IMPORTS ---
// Import the new ErrorBoundary component.
import ErrorBoundary from './ErrorBoundary.jsx';
// Lazily load the AdminPanel to keep the initial bundle size small.
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'));
// Import UI and section components with correct relative paths.
import AnimatedBackground from './components/ui/AnimatedBackground.jsx';
import LoadingSpinner from './components/ui/LoadingSpinner.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import Achievements from './components/Achievements.jsx';
import LearningJourney from './components/LearningJourney.jsx';
import Projects from './components/Projects.jsx';
import Certifications from './components/Certifications.jsx';
import Contact from './components/Contact.jsx';

// --- FIREBASE CONFIGURATION ---
// Load Firebase configuration from environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate environment variables to ensure Firebase can initialize correctly.
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value) {
    console.error(`❌ Missing Firebase environment variable: ${key}. Please check your .env file.`);
  }
});

// Initialize Firebase services within a try-catch block for robust error handling.
let app, db, auth, storage;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (err) {
  console.error('🔥 Firebase initialization failed:', err);
}

// --- CUSTOM HOOKS ---
// A custom hook to determine if the current viewport is mobile-sized.
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

// --- HOME PAGE COMPONENT ---
// A dedicated component for the main portfolio page layout.
const HomePage = ({ projects = [], licensesPdfUrl = '', internshipsPdfUrl = '', isMobile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  return (
    <>
      <Header isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} toggleMobileMenu={toggleMobileMenu} />
      <main className="relative z-10">
        <Hero />
        <div className="container mx-auto px-6 space-y-16 md:space-y-24">
          <About />
          <Experience />
          <Skills />
          <Achievements />
          <LearningJourney />
          <Projects projects={projects} isMobile={isMobile} />
          <Certifications licensesPdfUrl={licensesPdfUrl} internshipsPdfUrl={internshipsPdfUrl} />
        </div>
      </main>
      <Contact />
    </>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [portfolioData, setPortfolioData] = useState({
    projects: [],
    licensesPdfUrl: '',
    internshipsPdfUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  // Fetches all necessary data from Firestore in a single, efficient operation.
  const fetchAllData = useCallback(async () => {
    if (!db) {
      setError('Firebase is not initialized. Check your .env settings.');
      setLoading(false);
      return;
    }

    try {
      // Fetch all projects from the 'projects' collection.
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch PDF URLs from a dedicated 'portfolioAssets' document.
      const assetsDocRef = doc(db, 'portfolioAssets', 'main');
      const assetsDocSnap = await getDoc(assetsDocRef);
      const assetsData = assetsDocSnap.exists() ? assetsDocSnap.data() : {};

      setPortfolioData({
        projects,
        licensesPdfUrl: assetsData.licensesPdfUrl || '',
        internshipsPdfUrl: assetsData.internshipsPdfUrl || '',
      });
    } catch (err) {
      console.error('❌ Firebase fetch error:', err);
      setError('Failed to load portfolio data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Display a loading spinner during the initial data fetch.
  if (loading) return <LoadingSpinner />;

  // Display a clear error message if data fetching fails.
  if (error) {
    return (
      <div className="text-center mt-20 p-4">
        <h2 className="text-red-600 text-xl font-bold">{error}</h2>
      </div>
    );
  }

  return (
    // LazyMotion enables Framer Motion features on demand for better performance.
    <LazyMotion features={domAnimation}>
      <AnimatedBackground />
      <div className="relative text-slate-800 font-sans overflow-x-hidden">
        {/* The ErrorBoundary wraps the entire Router to catch any rendering errors. */}
        <ErrorBoundary>
          <Router>
            {/* Suspense provides a fallback while lazy-loaded components are fetched. */}
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      projects={portfolioData.projects}
                      licensesPdfUrl={portfolioData.licensesPdfUrl}
                      internshipsPdfUrl={portfolioData.internshipsPdfUrl}
                      isMobile={isMobile}
                    />
                  }
                />
                <Route
                  path="/admin"
                  element={<AdminPanel db={db} auth={auth} storage={storage} />}
                />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </div>
    </LazyMotion>
  );
}

export default App;
