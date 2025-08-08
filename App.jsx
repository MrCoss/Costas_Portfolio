// =================================================================================
// FILE: src/App.jsx
// =================================================================================
// This is the main component that orchestrates the entire application.
// It handles state management, data fetching, routing, and assembling all
// the individual section components into a single, cohesive page.
// =================================================================================

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LazyMotion, domAnimation } from 'framer-motion';

// --- COMPONENT IMPORTS ---
// Lazy load the AdminPanel for faster initial page load.
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'));

// UI Components are imported from a central file for clean code.
import { GlobalStyles, AnimatedBackground, LoadingSpinner } from './components/ui';

// Section Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import LearningJourney from './components/LearningJourney';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

// --- FIREBASE CONFIGURATION (SECURE) ---
// Keys are loaded from a .env file for security and are not exposed in the source code.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- CUSTOM HOOKS ---
// Detects if the screen size is mobile for conditional rendering and optimizations.
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

// --- MAIN APP COMPONENT ---
function App() {
    // --- STATE MANAGEMENT ---
    const [page, setPage] = useState('home');
    const [projects, setProjects] = useState([]);
    const [licensesPdfUrl, setLicensesPdfUrl] = useState('');
    const [internshipsPdfUrl, setInternshipsPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    // --- DATA FETCHING ---
    // useCallback ensures this function is not recreated on every render, improving performance.
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { console.error("Error fetching projects: ", error); }
        
        try {
            const licensesDoc = await getDoc(doc(db, "portfolioAssets", "licenses"));
            if (licensesDoc.exists()) setLicensesPdfUrl(licensesDoc.data().pdfUrl);
            const internshipsDoc = await getDoc(doc(db, "portfolioAssets", "internships"));
            if (internshipsDoc.exists()) setInternshipsPdfUrl(internshipsDoc.data().pdfUrl);
        } catch (error) { console.error("Error fetching portfolio assets: ", error); }
        finally { setLoading(false); }
    }, []);

    // --- EFFECTS ---
    // Handles routing based on URL hash and triggers the initial data fetch.
    useEffect(() => {
        fetchAllData();
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setPage(hash === 'admin' ? 'admin' : 'home');
        };
        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange(); // Check hash on initial load
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [fetchAllData]);

    // --- HANDLERS ---
    // Memoized handlers for performance.
    const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

    if (loading) return <LoadingSpinner />;

    // --- RENDER LOGIC ---
    return (
        <LazyMotion features={domAnimation}>
            <AnimatedBackground />
            <div className="relative text-[#334155] font-sans overflow-x-hidden">
                <GlobalStyles />
                {page === 'admin' ? (
                    <Suspense fallback={<LoadingSpinner />}>
                        <AdminPanel db={db} projects={projects} fetchProjects={fetchAllData} auth={auth} />
                    </Suspense>
                ) : (
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
                )}
            </div>
        </LazyMotion>
    );
}

export default App;