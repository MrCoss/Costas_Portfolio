// =================================================================================
// FILE: src/App.jsx 
// =================================================================================
// This is the main component that orchestrates the entire application.
// It handles Firebase initialization, routing, and top-level state management.
// =================================================================================

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { LazyMotion, domAnimation } from 'framer-motion';

// --- COMPONENT IMPORTS ---
// NOTE: These paths assume your App.jsx is in the `src` folder.
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'));
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
import Internship from './components/Internship.jsx'; 
import Contact from './components/Contact.jsx';

// --- FIREBASE CONFIGURATION ---
// IMPORTANT: Replace these placeholder strings with your actual Firebase project credentials.
// You can get these from the Firebase console in your project's settings.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_AUTH_DOMAIN_HERE",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE",
    measurementId: "YOUR_MEASUREMENT_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// --- CUSTOM HOOKS (Moved outside App component for performance) ---
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
};

// --- HOME PAGE COMPONENT (Moved outside App component for clarity) ---
const HomePage = ({ projects, licensesPdfUrl, internshipsPdfUrl, isMobile }) => {
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
    const isMobile = useIsMobile();

    const fetchAllData = useCallback(async () => {
        try {
            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const assetsDocRef = doc(db, "portfolioAssets", "main");
            const assetsDoc = await getDoc(assetsDocRef);
            const assetsData = assetsDoc.exists() ? assetsDoc.data() : {};

            setPortfolioData({
                projects,
                licensesPdfUrl: assetsData.licensesPdfUrl || '',
                internshipsPdfUrl: assetsData.internshipsPdfUrl || '',
            });

        } catch (error) {
            console.error("Firebase fetch error:", error);
            // Even if there's an error, stop loading so the user isn't stuck.
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <LazyMotion features={domAnimation}>
            <AnimatedBackground />
            <div className="relative text-[#334155] font-sans overflow-x-hidden">
                <Router>
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
            </div>
        </LazyMotion>
    );
}

export default App;
