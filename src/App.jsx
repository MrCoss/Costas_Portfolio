import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion, useInView, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

// --- OPTIMIZATION: Lazy load the AdminPanel ---
const AdminPanel = lazy(() => import('./components/AdminPanel')); // Assuming you move AdminPanel to its own file

// --- THEME & STYLES ---
const GlobalStyles = () => (
    <style>{`
        /* REFINED: A softer, more modern glass effect */
        .glass-card {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 1rem;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        /* REFINED: Smooth scrolling for anchor links */
        html {
            scroll-behavior: smooth;
        }
        /* ADMIN PANEL STYLES */
        .input-field {
            width: 100%;
            background-color: rgb(249 250 251 / 1); /* bg-gray-50 */
            border: 1px solid rgb(209 213 219 / 1); /* border-gray-300 */
            border-radius: 0.5rem; /* rounded-lg */
            padding: 0.75rem 1rem;
            color: #334155; /* Dark navy-gray */
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-field:focus {
            border-color: #2563eb; /* Navy blue focus */
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .btn-primary {
            background-image: linear-gradient(to right, #2563eb, #1e3a8a); /* Navy blue gradient */
            color: white;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        }
        .btn-secondary {
            background-color: transparent;
            border: 1px solid #d1d5db;
            color: #4b5563;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            transition: background-color 0.2s ease, color 0.2s ease;
        }
        .btn-secondary:hover {
            background-color: #e5e7eb;
        }
    `}</style>
);

// --- DYNAMIC & ANIMATED COMPONENTS ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#1e3a8a]"></div>
    </div>
);

// OPTIMIZATION: Memoize the component to prevent unnecessary re-renders
const AnimatedSection = React.memo(({ children, id, className = '', animateInView = true }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.section
            id={id}
            ref={ref}
            initial={animateInView ? { opacity: 0, y: 50 } : false}
            animate={animateInView ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`py-12 md:py-16 ${className}`}
        >
            {children}
        </motion.section>
    );
});

// OPTIMIZATION: Memoize the component
const AnimatedDivider = React.memo(() => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <div ref={ref} className="h-1 w-24 mx-auto my-8">
            <motion.div
                className="h-full bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ transformOrigin: 'center' }}
            />
        </div>
    );
});

// --- HEADER COMPONENT WITH FIX ---
// OPTIMIZATION: Memoize the component
const Header = React.memo(({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
    // FIX: New click handler to solve mobile navigation robustly
    const handleLinkClick = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        closeMobileMenu();
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    return (
        <header className="bg-white/70 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200/80">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#home" className="flex items-center space-x-2" onClick={handleLinkClick}>
                    <img src="/Costas_Portfolio/assets/logo.png" alt="Logo" className="h-10 w-auto md:h-12" />
                    <span className="text-2xl font-bold text-[#334155] hover:text-[#2563eb] transition-colors"></span>
                </a>
                <div className="hidden md:flex space-x-8 items-center text-[#4b5563] font-medium">
                    <a href="#about" className="hover:text-[#2563eb] transition-colors">About</a>
                    <a href="#experience" className="hover:text-[#2563eb] transition-colors">Experience</a>
                    <a href="#skills" className="hover:text-[#2563eb] transition-colors">Skills</a>
                    <a href="#achievements" className="hover:text-[#2563eb] transition-colors">Achievements</a>
                    <a href="#journey" className="hover:text-[#2563eb] transition-colors">Journey</a>
                    <a href="#projects" className="hover:text-[#2563eb] transition-colors">Projects</a>
                    <a href="#certifications" className="hover:text-[#2563eb] transition-colors">Certificates</a>
                    <a href="#contact" className="hover:text-[#2563eb] transition-colors">Contact</a>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-[#4b5563] focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-md px-6 py-4 space-y-3 text-[#4b5563] font-medium"
                    >
                        <a href="#about" onClick={handleLinkClick} className="block hover:text-[#2563eb]">About</a>
                        <a href="#experience" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Experience</a>
                        <a href="#skills" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Skills</a>
                        <a href="#achievements" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Achievements</a>
                        <a href="#journey" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Journey</a>
                        <a href="#projects" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Projects</a>
                        <a href="#certifications" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Certificates</a>
                        <a href="#contact" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Contact</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
});

// --- PAGE SECTION COMPONENTS ---
// OPTIMIZATION: All section components are memoized
const Hero = React.memo(() => (
    <section id="home" className="min-h-screen flex items-center justify-center text-center md:text-left relative overflow-hidden bg-[#f5f7fa]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center relative z-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="md:col-span-3">
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#334155] mb-4">
                    <span className="block mb-2 text-xl font-normal text-[#64748b]">Hello, I'm</span>
                    Costas Pinto
                </h1>
                <p className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#1e3a8a]">
                    Data Science & ML Enthusiast
                </p>
                <p className="max-w-xl text-[#4b5563] leading-relaxed mb-8 mx-auto md:mx-0">
                    Transforming raw data into actionable insights. I build intelligent systems and solve complex problems with a passion for machine learning and data visualization.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-[#2563eb]/20 transition-all hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Download CV
                    </motion.a>
                    <div className="flex gap-4">
                        <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2563eb] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg></a>
                        <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#334155] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg></a>
                    </div>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4, type: 'spring' }} className="md:col-span-2 flex justify-center items-center relative">
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-gradient-to-tr from-[#2563eb]/20 via-[#1e3a8a]/20 to-[#2563eb]/30 rounded-full opacity-40 blur-3xl" />
                    <div className="relative z-10 flex justify-center items-center">
                        <img src="./assets/Costas.png" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/334155?text=CP'; }} alt="Costas Pinto" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-contain z-10" />
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
));

const About = React.memo(() => (
    <AnimatedSection id="about">
        <h2 className="text-4xl font-bold text-[#334155] text-center">About Me</h2>
        <AnimatedDivider />
        <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
            <p className="text-lg leading-relaxed text-[#4b5563] text-center">
                As a current MCA student at Manipal University, Jaipur, with a Bachelor's in Computer Science, I am deeply engaged in the world of data analytics and machine learning. My internship at SkillFied Mentor provided a strong foundation in data exploration, visualization, and interpretation using tools like Python, Excel, and Power BI. I am passionate about leveraging technology to make complex subjects accessible, a skill I've honed as the founder of JHT SMART STEPS LEARNING. I am eager to apply my analytical skills to new challenges in the AI and ML space.
            </p>
        </div>
    </AnimatedSection>
));

const Projects = React.memo(({ projects }) => (
    <AnimatedSection id="projects" animateInView={false}>
        <h2 className="text-4xl font-bold text-[#334155] text-center">My Projects</h2>
        <AnimatedDivider />
        <div className="min-h-[60vh] w-full px-4 md:px-0">
            {projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => (
                        <motion.div key={project.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 300 } }} className="p-6 flex flex-col rounded-2xl glass-card overflow-hidden">
                            {/* OPTIMIZATION: Lazy load project images */}
                            <img loading="lazy" src={project.imageUrl || 'https://placehold.co/600x400/e2e8f0/334155?text=Project'} alt={project.title} className="rounded-lg mb-4 aspect-video object-cover border border-gray-200/50" />
                            <h3 className="text-xl font-bold text-[#334155] mb-2">{project.title}</h3>
                            <p className="text-[#4b5563] flex-grow mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags?.map(tag => (
                                    <span key={tag} className="bg-[#dbeafe] text-[#1e3a8a] text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                            {project.projectLink && <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="mt-auto text-center font-semibold text-[#2563eb] border border-[#2563eb] rounded-full py-2 px-4 hover:bg-[#2563eb] hover:text-white transition-all duration-300">View Project</a>}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="min-h-[20vh] flex justify-center items-center">
                    <p className="text-center text-[#4b5563] text-lg">No projects found. Please add some projects from the admin panel.</p>
                </div>
            )}
        </div>
    </AnimatedSection>
));

// ... other section components like Experience, Skills, etc. would also be wrapped in React.memo ...
// For brevity, I've omitted re-pasting them, but you should apply React.memo to them as well.
const Experience = React.memo(() => { /* ... existing code ... */ });
const Skills = React.memo(() => { /* ... existing code ... */ });
const Achievements = React.memo(() => { /* ... existing code ... */ });
const LearningJourney = React.memo(() => { /* ... existing code ... */ });
const Certifications = React.memo(({ licensesPdfUrl, internshipsPdfUrl }) => { /* ... existing code ... */ });
const Contact = React.memo(() => { /* ... existing code ... */ });


// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyAZjJnEruroTDXYEjbne6-BHPA-lJMRw1c",
    authDomain: "costas-portfolio.firebaseapp.com",
    projectId: "costas-portfolio",
    storageBucket: "costas-portfolio.appspot.com",
    messagingSenderId: "958634149930",
    appId: "1:958634149930:web:b847a2bc997021711a5b53",
    measurementId: "G-5ZT1KDPJPT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- MAIN APP COMPONENT ---
function App() {
    const [page, setPage] = useState('home');
    const [projects, setProjects] = useState([]);
    const [licensesPdfUrl, setLicensesPdfUrl] = useState('');
    const [internshipsPdfUrl, setInternshipsPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchAllData = async () => {
        try {
            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);

            const licensesDoc = await getDoc(doc(db, "portfolioAssets", "licenses"));
            if (licensesDoc.exists()) setLicensesPdfUrl(licensesDoc.data().pdfUrl);

            const internshipsDoc = await getDoc(doc(db, "portfolioAssets", "internships"));
            if (internshipsDoc.exists()) setInternshipsPdfUrl(internshipsDoc.data().pdfUrl);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();

        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setPage(hash === 'admin' ? 'admin' : 'home');
        };

        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    if (loading) return <LoadingSpinner />;

    return (
        <LazyMotion features={domAnimation}>
            <div className="bg-[#f5f7fa] text-[#334155] font-sans overflow-x-hidden">
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
                                <Projects projects={projects} />
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

/*
NOTE: For the lazy loading of AdminPanel to work, you should move all Admin-related components
(AdminPanel, AdminLogin, ProjectForm, ManageContent) into a separate file,
e.g., `./components/AdminPanel.js`, and export the AdminPanel component from there.
*/