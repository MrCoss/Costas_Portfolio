// =================================================================================
// FILE: src/App.jsx (FINAL & CORRECTED)
// =================================================================================

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { LazyMotion, domAnimation } from 'framer-motion';

// --- CONTEXT & COMPONENT IMPORTS ---
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './ErrorBoundary.jsx';
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
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'));

// --- GITHUB PAGES ROUTING FIX (Unchanged) ---
const RedirectHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      sessionStorage.removeItem('redirect');
      const pathWithoutBase = redirectPath.replace(/^\/Costas_Portfolio/, '');
      navigate(pathWithoutBase || '/', { replace: true });
    }
  }, [navigate]);
  return null;
};

// --- FIREBASE CONFIGURATION (Unchanged) ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// --- CUSTOM HOOKS (Unchanged) ---
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};

// --- HOME PAGE COMPONENT (REFACTORED) ---
const HomePage = (props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  return (
    <>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        toggleMobileMenu={toggleMobileMenu}
      />
      <main className="relative z-10">
        <Hero />
        <div className="container mx-auto px-6 space-y-16 md:space-y-24">
          <About />
          <Experience />
          <Skills />
          <Achievements />
          <LearningJourney />
          <Projects projects={props.projects} isMobile={props.isMobile} />
          <Certifications 
             licensesImageUrls={props.licensesImageUrls}
             internshipsImageUrls={props.internshipsImageUrls}
          />
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
    licensesImageUrls: [],
    internshipsImageUrls: [],
  });
  const [firebaseServices, setFirebaseServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  const fetchAllData = useCallback(async (db) => {
    try {
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const assetsDocRef = doc(db, 'portfolioAssets', 'main');
      const assetsDocSnap = await getDoc(assetsDocRef);
      const assetsData = assetsDocSnap.exists() ? assetsDocSnap.data() : {};
      setPortfolioData({
        projects,
        // FIX: Fetching the correct keys with default empty arrays
        licensesImageUrls: assetsData.licensesImageUrls || [],
        internshipsImageUrls: assetsData.internshipsImageUrls || [],
      });
    } catch (err) {
      console.error('❌ Firebase fetch error:', err);
      setError('Failed to load portfolio data. Please check your Firestore rules and collection names.');
    }
  }, []);

  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        if (Object.values(firebaseConfig).some(value => !value)) {
          throw new Error("One or more Firebase environment variables are missing. Please check your .env file.");
        }
        const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const storage = getStorage(app);
        setFirebaseServices({ db, auth, storage });
        await fetchAllData(db);
      } catch (err) {
        console.error("🔥 Firebase initialization or data fetch failed:", err);
        setError(`Failed to connect to services. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    initializeAndFetch();
  }, [fetchAllData]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-red-100/50 border border-red-500 p-8 rounded-lg max-w-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Application Error</h2>
          <p className="text-slate-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LazyMotion features={domAnimation}>
          <AnimatedBackground />
          <div className="relative font-sans overflow-x-hidden">
            <Router basename="/Costas_Portfolio/">
              <RedirectHandler />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        projects={portfolioData.projects}
                        licensesImageUrls={portfolioData.licensesImageUrls}
                        internshipsImageUrls={portfolioData.internshipsImageUrls}
                        isMobile={isMobile}
                      />
                    }
                  />
                  <Route
                    path="/admin"
                    element={firebaseServices && <AdminPanel {...firebaseServices} />}
                  />
                </Routes>
              </Suspense>
            </Router>
          </div>
        </LazyMotion>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;