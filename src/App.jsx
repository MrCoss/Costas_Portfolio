import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { motion, useInView, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// OPTIMIZATION: Lazy load the AdminPanel for faster initial page load.
const AdminPanel = lazy(() => import('./components/AdminPanel.jsx'));

// --- THEME & STYLES ---
const GlobalStyles = () => (
    <style>{`
        body { background-color: #f5f7fa; }
        .glass-card { 
            background: rgba(255, 255, 255, 0.5); 
            backdrop-filter: blur(12px); 
            -webkit-backdrop-filter: blur(12px); 
            border-radius: 1rem; 
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07); 
            border: 1px solid rgba(255, 255, 255, 0.18);
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        .glow-effect {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1), transparent 70%);
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: -1;
        }
        .glass-card:hover .glow-effect { opacity: 1; }
        html { scroll-behavior: smooth; }
        .input-field { width: 100%; background-color: rgb(249 250 251 / 1); border: 1px solid rgb(209 213 219 / 1); border-radius: 0.5rem; padding: 0.75rem 1rem; color: #334155; outline: none; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .input-field:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
        .btn-primary { background-image: linear-gradient(to right, #2563eb, #1e3a8a); color: white; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 9999px; transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
        .btn-primary:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); }
        .btn-secondary { background-color: transparent; border: 1px solid #d1d5db; color: #4b5563; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 9999px; transition: background-color 0.2s ease, color 0.2s ease; cursor: pointer; }
        .btn-secondary:hover { background-color: #e5e7eb; }
    `}</style>
);

// NEW: Abstract animated background component
const AnimatedBackground = () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#f5f7fa]">
        <style>{`
            @keyframes move {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .gradient-bg {
                width: 150vmax;
                height: 150vmax;
                position: absolute;
                top: 50%; left: 50%;
                background: radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 50%),
                            radial-gradient(circle, rgba(29, 78, 216, 0.1), transparent 60%);
                animation: move 25s linear infinite;
                opacity: 0.5;
            }
        `}</style>
        <div className="gradient-bg"></div>
    </div>
);

// UPDATE: New AI-themed loading spinner
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-[#f5f7fa]">
        <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#1e3a8a">
            <style>{`.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_zKoa{animation-timing-function:steps(8,end)}@keyframes spinner_zKoa{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
            <g className="spinner_V8m1"><rect x="47" y="24" width="6" height="12" rx="3"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(45 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(90 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(135 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(180 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(225 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(270 50 50)"></rect><rect x="47" y="24" width="6" height="12" rx="3" transform="rotate(315 50 50)"></rect></g>
        </svg>
    </div>
);

const AnimatedSection = React.memo(({ children, id, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    return (
        <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 50 }} animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }} transition={{ duration: 0.8, ease: "easeOut" }} className={`py-12 md:py-16 ${className}`}>
            {children}
        </motion.section>
    );
});

const AnimatedDivider = React.memo(() => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    return (
        <div ref={ref} className="h-1 w-24 mx-auto my-8">
            <motion.div className="h-full bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: isInView ? 1 : 0 }} transition={{ duration: 1, ease: "easeOut" }} style={{ transformOrigin: 'center' }} />
        </div>
    );
});

// --- HEADER COMPONENT ---
const Header = React.memo(({ isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }) => {
    const handleLinkClick = (e) => { e.preventDefault(); const targetId = e.currentTarget.getAttribute('href'); const targetElement = document.querySelector(targetId); closeMobileMenu(); if (targetElement) { setTimeout(() => { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); } };
    return (
        <header className="bg-white/70 backdrop-blur-md fixed top-0 w-full z-50 border-b border-gray-200/80">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#home" className="flex items-center space-x-2" onClick={handleLinkClick}>
                    <img src="/Costas_Portfolio/assets/logo.png" alt="Logo" className="h-10 w-auto md:h-12" />
                </a>
                <div className="hidden md:flex space-x-8 items-center text-[#4b5563] font-medium">
                    <a href="#about" className="hover:text-[#2563eb] transition-colors">About</a>
                    <a href="#experience" className="hover:text-[#2563eb] transition-colors">Experience</a>
                    <a href="#skills" className="hover:text-[#2563eb] transition-colors">Skills</a>
                    <a href="#projects" className="hover:text-[#2563eb] transition-colors">Projects</a>
                    <a href="#contact" className="hover:text-[#2563eb] transition-colors">Contact</a>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-[#4b5563] focus:outline-none">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
                    </button>
                </div>
            </nav>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-md px-6 py-4 space-y-3 text-[#4b5563] font-medium">
                        <a href="#about" onClick={handleLinkClick} className="block hover:text-[#2563eb]">About</a>
                        <a href="#experience" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Experience</a>
                        <a href="#skills" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Skills</a>
                        <a href="#projects" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Projects</a>
                        <a href="#contact" onClick={handleLinkClick} className="block hover:text-[#2563eb]">Contact</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
});

// --- PAGE SECTION COMPONENTS ---
const Hero = React.memo(() => (
    <section id="home" className="min-h-screen flex items-center justify-center text-center md:text-left relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center relative z-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="md:col-span-3">
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#334155] mb-4">
                    <span className="block mb-2 text-xl font-normal text-[#64748b]">Hello, I'm</span> Costas Pinto
                </h1>
                <TypeAnimation
                    sequence={[
                        'Data Science Enthusiast', 2000,
                        'Machine Learning Engineer', 2000,
                        'Full-Stack Developer', 2000,
                        'AI Innovator', 2000,
                    ]}
                    wrapper="p"
                    speed={50}
                    className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] h-10"
                    repeat={Infinity}
                />
                <p className="max-w-xl text-[#4b5563] leading-relaxed mb-8 mx-auto md:mx-0">Transforming raw data into actionable insights. I build intelligent systems and solve complex problems with a passion for machine learning and data visualization.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <motion.a href="/Costas_Portfolio/assets/your_cv.pdf" download="CostasPinto_CV.pdf" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-[#2563eb]/20 transition-all hover:shadow-xl">
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
                        <img loading="lazy" src="./assets/Costas.png" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/334155?text=CP'; }} alt="Costas Pinto" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-contain z-10" />
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
));

const About = React.memo(() => ( <AnimatedSection id="about"> <h2 className="text-4xl font-bold text-[#334155] text-center">About Me</h2> <AnimatedDivider /> <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card"><div className="glow-effect"></div><p className="text-lg leading-relaxed text-[#4b5563] text-center">As a current MCA student at Manipal University, Jaipur, with a Bachelor's in Computer Science, I am deeply engaged in the world of data analytics and machine learning. My internship at SkillFied Mentor provided a strong foundation in data exploration, visualization, and interpretation using tools like Python, Excel, and Power BI. I am passionate about leveraging technology to make complex subjects accessible, a skill I've honed as the founder of JHT SMART STEPS LEARNING. I am eager to apply my analytical skills to new challenges in the AI and ML space.</p></div></AnimatedSection>));
const TimelineItem = React.memo(({ date, title, company, details }) => ( <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }} className="relative pl-8 py-4 border-l-2 border-[#a5b4fc]"><div className="absolute -left-[11px] top-6 w-5 h-5 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full border-4 border-white"></div><p className="text-[#64748b] mb-1 font-medium">{date}</p><h3 className="text-2xl font-bold text-[#334155]">{title}</h3><p className="text-lg text-[#2563eb] font-semibold mb-3">{company}</p><ul className="list-disc list-inside text-[#4b5563] space-y-2">{details.map((item, index) => <li key={index}>{item}</li>)}</ul></motion.div>));
const Experience = React.memo(() => ( <AnimatedSection id="experience"><h2 className="text-4xl font-bold text-[#334155] text-center">Experience</h2><AnimatedDivider /><div className="max-w-3xl mx-auto space-y-12"><TimelineItem date="2024 - Present" title="Data Analyst Intern" company="SkillFied Mentor (Remote)" details={["Collected, cleaned, and preprocessed datasets from diverse sources.","Performed exploratory data analysis (EDA) using Python, Excel, and Power BI.","Generated actionable insights to support internal strategy and client deliverables."]} /><TimelineItem date="2022 - Present" title="Founder" company="JHT SMART STEPS LEARNING (On-site)" details={["Leveraged technology to make education accessible and easy to understand.","Created personalized lesson plans and educational resources for students.","Tracked and assessed student progress, offering one-on-one coaching."]} /></div></AnimatedSection>));

const Skills = React.memo(() => {
    const [openCategory, setOpenCategory] = useState('Programming Languages');
    const handleToggle = (category) => setOpenCategory(prev => (prev === category ? null : category));
    const categorizedSkills = { 'Programming Languages': [{ name: 'Python', level: 90 }, { name: 'JavaScript', level: 85 }, { name: 'Java', level: 75 }, { name: 'SQL', level: 80 }], 'Data Science & Analytics': [{ name: 'Data Analysis', level: 90 }, { name: 'Machine Learning', level: 75 }, { name: 'Power BI', level: 85 }, { name: 'Excel', level: 95 }], 'Web & App Development': [{ name: 'React', level: 85 }, { name: 'Firebase', level: 80 }, { name: 'Tailwind CSS', level: 80 }, { name: 'Streamlit', level: 75 }], 'AI & Generative AI': [{ name: 'Generative AI Concepts', level: 85 }, { name: 'Prompt Engineering', level: 90 }, { name: 'LangChain', level: 75 }], 'Tools & Workflow': [{ name: 'Git & GitHub', level: 95 }, { name: 'Version Control', level: 90 }] };
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
    return ( <AnimatedSection id="skills"><h2 className="text-4xl font-bold text-[#334155] text-center">My Skills</h2><AnimatedDivider /><div className="p-4 md:p-8 max-w-4xl mx-auto rounded-2xl glass-card"><div className="glow-effect"></div><div className="space-y-2">{Object.entries(categorizedSkills).map(([category, skills]) => ( <div key={category} className="border-b border-gray-300/50 last:border-b-0"><button onClick={() => handleToggle(category)} className="w-full flex justify-between items-center py-4 text-left text-xl font-semibold text-[#334155] focus:outline-none"><span>{category}</span><motion.span animate={{ rotate: openCategory === category ? 180 : 0 }}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg></motion.span></button><AnimatePresence>{openCategory === category && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden"><motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2 pb-6 px-2">{skills.map((skill) => ( <motion.div variants={itemVariants} key={skill.name}><p className="text-lg font-medium text-[#4b5563] mb-1">{skill.name}</p><div className="bg-gray-300 w-full rounded-full h-2.5"><motion.div className="h-2.5 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1e3a8a]" initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 1, ease: "easeOut" }} /></div></motion.div>))}</motion.div></motion.div>)}</AnimatePresence></div>))}</div></div></AnimatedSection> );
});

const Achievements = React.memo(() => ( <AnimatedSection id="achievements"><h2 className="text-4xl font-bold text-[#334155] text-center">Key Achievements</h2><AnimatedDivider /><div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card"><div className="glow-effect"></div><ul className="list-disc list-inside text-[#4b5563] space-y-3 text-lg"><li>Completed <strong>60+ Certifications</strong> from IBM, Google, Meta, Microsoft, and Forage.</li><li>Built and deployed <strong>25+ AI/Data/Full-stack projects</strong> solving real-world problems.</li><li>Earned top-tier recognitions in job simulations at <strong>BCG, Lloyds, BA, EA, TATA</strong>, and more.</li><li>Founded <strong>JHT SMART STEPS LEARNING</strong> – empowering students through digital education.</li></ul></div></AnimatedSection>));
const LearningJourney = React.memo(() => ( <AnimatedSection id="journey"><h2 className="text-4xl font-bold text-[#334155] text-center">My Learning Journey</h2><AnimatedDivider /><div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card"><div className="glow-effect"></div><p>From mastering foundational concepts to building AI-powered solutions, my journey is marked by continuous growth:</p><ul className="list-disc list-inside space-y-3 text-lg"><li><strong>2023:</strong> Learned Python, Java, and front-end development. Built my first ML models.</li><li><strong>2024:</strong> Completed 60+ certifications in AI, Data Science, UX, and Full-stack Dev.</li><li><strong>Ongoing:</strong> Practicing daily with real-world challenges, GitHub repos, and internships.</li></ul></div></AnimatedSection>));
const Projects = React.memo(({ projects }) => { const ref = useRef(null); const isInView = useInView(ref, { once: true, amount: 0.1 }); const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }; const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }; return ( <AnimatedSection id="projects" className="!py-0"><h2 className="text-4xl font-bold text-[#334155] text-center">My Projects</h2><AnimatedDivider /><div className="min-h-[60vh] w-full px-4 md:px-0">{projects.length > 0 ? ( <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{projects.map((project) => ( <motion.div variants={itemVariants} key={project.id} className="p-6 flex flex-col rounded-2xl glass-card overflow-hidden"><div className="glow-effect"></div><img loading="lazy" src={project.imageUrl || 'https://placehold.co/600x400/e2e8f0/334155?text=Project'} alt={project.title} className="rounded-lg mb-4 aspect-video object-cover border border-gray-200/50" /><h3 className="text-xl font-bold text-[#334155] mb-2">{project.title}</h3><p className="text-[#4b5563] flex-grow mb-4">{project.description}</p><div className="flex flex-wrap gap-2 mb-4">{project.tags?.map(tag => (<span key={tag} className="bg-[#dbeafe] text-[#1e3a8a] text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>))}</div>{project.projectLink && <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="mt-auto text-center font-semibold text-[#2563eb] border border-[#2563eb] rounded-full py-2 px-4 hover:bg-[#2563eb] hover:text-white transition-all duration-300 z-10">View Project</a>}</motion.div>))}</motion.div>) : ( <div className="min-h-[20vh] flex justify-center items-center"><p className="text-center text-[#4b5563] text-lg">No projects found. Please add some projects from the admin panel.</p></div>)}</div></AnimatedSection> ); });
const Certifications = React.memo(({ licensesPdfUrl, internshipsPdfUrl }) => ( <AnimatedSection id="certifications"><h2 className="text-4xl font-bold text-[#334155] text-center">Certificates</h2><AnimatedDivider /><div className="text-center flex flex-col md:flex-row justify-center items-center gap-6"><motion.a href={licensesPdfUrl || '#'} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-[#2563eb]/20 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] ${!licensesPdfUrl && 'opacity-50 cursor-not-allowed'}`}>View Licenses & Certs</motion.a><motion.a href={internshipsPdfUrl || '#'} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-[#2563eb]/20 bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] ${!internshipsPdfUrl && 'opacity-50 cursor-not-allowed'}`}>View Internship Certs</motion.a></div></AnimatedSection>));
const Contact = React.memo(() => ( <footer id="contact" className="bg-[#e2e8f0] border-t border-gray-300 mt-20"><div className="container mx-auto px-6 py-16 text-center"><h2 className="text-4xl font-bold text-[#334155] mb-4">Let's Connect</h2><p className="text-[#4b5563] max-w-2xl mx-auto mb-8">I'm always eager to connect. Whether you have a project in mind, a question, or just want to say hi, my inbox is always open.</p><form action="https://formspree.io/f/YOUR_UNIQUE_CODE" method="POST" className="max-w-xl mx-auto space-y-4 text-left"><input type="email" name="email" placeholder="Your Email" className="input-field" required /><textarea name="message" placeholder="Your Message" className="input-field h-32" required></textarea><button type="submit" className="btn-primary w-full">Send Message</button></form><div className="border-t border-gray-300 mt-12 pt-8 text-[#64748b]"><div className="flex justify-center items-center gap-6 mb-4"><a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#2563eb] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg></a><a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#334155] transition-colors"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg></a></div><p>&copy; {new Date().getFullYear()} Costas Pinto. All Rights Reserved.</p></div></div></footer>));

// --- FIREBASE CONFIGURATION ---
// SECURE: Use environment variables for Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            setProjects(projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching projects: ", error);
        }
        try {
            const licensesDoc = await getDoc(doc(db, "portfolioAssets", "licenses"));
            if (licensesDoc.exists()) setLicensesPdfUrl(licensesDoc.data().pdfUrl);
            const internshipsDoc = await getDoc(doc(db, "portfolioAssets", "internships"));
            if (internshipsDoc.exists()) setInternshipsPdfUrl(internshipsDoc.data().pdfUrl);
        } catch (error) {
            console.error("Error fetching portfolio assets: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setPage(hash === 'admin' ? 'admin' : 'home');
        };
        window.addEventListener('hashchange', handleHashChange, false);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [fetchAllData]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    if (loading) return <LoadingSpinner />;

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