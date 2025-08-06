import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion, useInView, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

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
            color: rgb(17 24 39 / 1); /* text-gray-900 */
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .btn-primary {
            background-image: linear-gradient(to right, #3b82f6, #14b8a6);
            color: white;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
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
    <div className="flex justify-center items-center h-screen bg-[#fdfcf9]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
    </div>
);

const AnimatedSection = ({ children, id, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.section
            id={id}
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`py-20 md:py-24 ${className}`}
        >
            {children}
        </motion.section>
    );
};

const AnimatedDivider = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <div ref={ref} className="h-1 w-24 mx-auto my-8">
            <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ transformOrigin: 'center' }}
            />
        </div>
    );
};

const SectionSeparator = () => (
    <div className="my-8 md:my-12">
        <hr className="border-t border-gray-200/80 max-w-4xl mx-auto" />
    </div>
);


// --- UI COMPONENTS ---

const Header = () => (
    <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/80"
    >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#home" className="text-2xl font-bold text-gray-800 hover:text-blue-500 transition-colors">Mr.Coss</a>
            <div className="hidden md:flex space-x-8 items-center text-gray-600 font-medium">
                <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
                <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
                <a href="#skills" className="hover:text-blue-500 transition-colors">Skills</a>
                <a href="#projects" className="hover:text-blue-500 transition-colors">Projects</a>
                <a href="#certifications" className="hover:text-blue-500 transition-colors">Certificates</a>
                <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
            </div>
        </nav>
    </motion.header>
);

const Hero = () => (
    <section id="home" className="min-h-screen flex items-center justify-center text-center md:text-left relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center relative z-10">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:col-span-3"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-4">
                    <span className="block mb-2 text-xl font-normal text-gray-500">Hello, I'm</span>
                    Costas Pinto
                </h1>
                <p className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    Data Science & ML Enthusiast
                </p>
                <p className="max-w-xl text-gray-600 leading-relaxed mb-8 mx-auto md:mx-0">
                    Transforming raw data into actionable insights. I build intelligent systems and solve complex problems with a passion for machine learning and data visualization.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                    <motion.a href="#" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                       Download CV
                    </motion.a>
                    <div className="flex gap-4">
                        <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                        </a>
                        <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-colors">
                           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg>
                        </a>
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
                className="md:col-span-2 flex justify-center items-center relative"
            >
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-tr from-blue-200 via-teal-200 to-blue-300 rounded-full opacity-40 blur-3xl"
                    />
                    <div className="relative z-10 flex justify-center items-center">
                        {/* FIX: Changed the image path to a relative URL for GitHub Pages compatibility */}
                        <img
                            src="./assets/Costas.png"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/400x400/e2e8f0/334155?text=CP';
                            }}
                            alt="Costas Pinto"
                            className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] shadow-2xl object-contain z-10"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

const About = () => (
    <AnimatedSection id="about">
        <h2 className="text-4xl font-bold text-gray-800 text-center">About Me</h2>
        <AnimatedDivider />
        <div className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
            <p className="text-lg leading-relaxed text-gray-700 text-center">
                As a current MCA student at Manipal University, Jaipur, with a Bachelor's in Computer Science, I am deeply engaged in the world of data analytics and machine learning. My internship at SkillFied Mentor provided a strong foundation in data exploration, visualization, and interpretation using tools like Python, Excel, and Power BI. I am passionate about leveraging technology to make complex subjects accessible, a skill I've honed as the founder of JHT SMART STEPS LEARNING. I am eager to apply my analytical skills to new challenges in the AI and ML space.
            </p>
        </div>
    </AnimatedSection>
);

const TimelineItem = ({ date, title, company, details }) => (
    <motion.div
        whileHover={{ x: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative pl-8 py-4 border-l-2 border-blue-200"
    >
        <div className="absolute -left-[11px] top-6 w-5 h-5 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full border-4 border-white"></div>
        <p className="text-gray-500 mb-1 font-medium">{date}</p>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="text-lg text-teal-600 font-semibold mb-3">{company}</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
            {details.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </motion.div>
);

const Experience = () => (
    <AnimatedSection id="experience">
        <h2 className="text-4xl font-bold text-gray-800 text-center">Experience</h2>
        <AnimatedDivider />
        <div className="max-w-3xl mx-auto space-y-12">
            <TimelineItem
                date="Jul 2025 - Present"
                title="Data Analyst Intern"
                company="SkillFied Mentor (Remote)"
                details={[
                    "Collected, cleaned, and preprocessed datasets from diverse sources.",
                    "Performed exploratory data analysis (EDA) using Python, Excel, and Power BI.",
                    "Generated actionable insights to support internal strategy and client deliverables.",
                    "Collaborated with a cross-functional team to build dashboards and reports."
                ]}
            />
            <TimelineItem
                date="Aug 2022 - Present"
                title="Founder"
                company="JHT SMART STEPS LEARNING (On-site)"
                details={[
                    "Leveraged technology to make education accessible and easy to understand.",
                    "Created personalized lesson plans and educational resources for students.",
                    "Tracked and assessed student progress, offering one-on-one coaching."
                ]}
            />
        </div>
    </AnimatedSection>
);

const Skills = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const skills = [
        { name: 'Python', level: 95 },
        { name: 'Data Analysis', level: 90 },
        { name: 'Power BI', level: 85 },
        { name: 'Machine Learning', level: 80 },
        { name: 'SQL', level: 88 },
        { name: 'Excel', level: 92 },
    ];

    return (
        <AnimatedSection id="skills">
            <h2 className="text-4xl font-bold text-gray-800 text-center">My Skills</h2>
            <AnimatedDivider />
            <div ref={ref} className="p-8 md:p-12 max-w-4xl mx-auto rounded-2xl glass-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skills.map((skill, index) => (
                        <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-lg font-semibold text-gray-700">{skill.name}</span>
                                <span className="text-sm font-medium text-teal-600">{skill.level}%</span>
                            </div>
                            <div className="bg-gray-200 w-full rounded-full h-2.5">
                                <motion.div
                                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-teal-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: isInView ? `${skill.level}%` : 0 }}
                                    transition={{ duration: 1, delay: 0.1 * index, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const Projects = ({ projects }) => (
    <AnimatedSection id="projects">
        <h2 className="text-4xl font-bold text-gray-800 text-center">My Projects</h2>
        <AnimatedDivider />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 300 } }}
                    className="p-6 flex flex-col rounded-2xl glass-card overflow-hidden"
                >
                    <img src={project.imageUrl || 'https://placehold.co/600x400/e2e8f0/334155?text=Project'} alt={project.title} className="rounded-lg mb-4 aspect-video object-cover border border-gray-200/50"/>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 flex-grow mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags?.map(tag => <span key={tag} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}
                    </div>
                    {project.projectLink && (
                           <a
                               href={project.projectLink}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="mt-auto text-center font-semibold text-blue-600 border border-blue-500 rounded-full py-2 px-4 hover:bg-blue-500 hover:text-white transition-all duration-300"
                           >
                               View Project
                           </a>
                    )}
                </motion.div>
            ))}
        </div>
    </AnimatedSection>
);

const Certifications = ({ licensesPdfUrl, internshipsPdfUrl }) => (
    <AnimatedSection id="certifications">
        <h2 className="text-4xl font-bold text-gray-800 text-center">Certificates</h2>
        <AnimatedDivider />
        <div className="text-center flex flex-col md:flex-row justify-center items-center gap-6">
            <motion.a
                href={licensesPdfUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-500 to-teal-400 ${!licensesPdfUrl && 'opacity-50 cursor-not-allowed'}`}
            >
                View Licenses & Certs
            </motion.a>
            <motion.a
                href={internshipsPdfUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className={`inline-block text-white font-bold py-4 px-8 text-lg rounded-full shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-500 to-teal-400 ${!internshipsPdfUrl && 'opacity-50 cursor-not-allowed'}`}
            >
                View Internship Certs
            </motion.a>
        </div>
    </AnimatedSection>
);

const Contact = () => (
    <footer id="contact" className="bg-gray-100 border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-16 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Let's Connect</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">Have a project in mind, a question, or just want to say hi? My inbox is always open.</p>
            <a href="mailto:costaspinto312@gmail.com" className="inline-block text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-80 transition-opacity">
                costaspinto312@gmail.com
            </a>
            <div className="border-t border-gray-200 mt-12 pt-8 text-gray-500">
                <p>&copy; {new Date().getFullYear()} Costas Pinto. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

// --- ADMIN PANEL COMPONENTS (REFACTORED) ---

const AdminLogin = ({ onLogin, message }) => {
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // IMPORTANT: This is NOT secure for production. Use Firebase Auth for real applications.
        if (password === 'admin123') {
            onLogin(true);
        } else {
            onLogin(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 rounded-2xl w-full max-w-sm glass-card">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h2>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 mb-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" className="w-full text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400">Login</button>
                {message && <p className="text-red-500 text-center mt-4">{message}</p>}
            </form>
        </div>
    );
};

const ProjectForm = ({ db, fetchProjects, existingProject, onDone }) => {
    const [project, setProject] = useState({
        title: existingProject?.title || '',
        description: existingProject?.description || '',
        tags: Array.isArray(existingProject?.tags)
            ? existingProject.tags.join(', ')
            : existingProject?.tags || '',
        projectLink: existingProject?.projectLink || '',
        imageUrl: existingProject?.imageUrl || '',
    });

    const [message, setMessage] = useState('');
    const isEditing = !!existingProject;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(isEditing ? 'Updating...' : 'Adding...');

        const tagsArray = (project.tags || '')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const projectData = {
            ...project,
            tags: tagsArray,
        };

        try {
            if (isEditing) {
                await updateDoc(doc(db, 'projects', existingProject.id), projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }
            setMessage(`Project ${isEditing ? 'updated' : 'added'} successfully!`);
            fetchProjects();
            setTimeout(() => onDone(), 1500);
        } catch (error) {
            console.error(error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-8 rounded-2xl glass-card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} className="input-field" required />
                <textarea name="description" placeholder="Description" value={project.description} onChange={handleChange} className="input-field" required />
                <input type="text" name="tags" placeholder="Tags (comma-separated)" value={project.tags} onChange={handleChange} className="input-field" />
                <input type="url" name="projectLink" placeholder="Project Link (URL)" value={project.projectLink} onChange={handleChange} className="input-field" />
                <input type="url" name="imageUrl" placeholder="Image URL (e.g., from Imgur, Cloudinary)" value={project.imageUrl} onChange={handleChange} className="input-field" />
                <button type="submit" className="btn-primary w-full">{isEditing ? 'Update Project' : 'Add Project'}</button>
                <button type="button" onClick={onDone} className="btn-secondary w-full">Cancel</button>
                {message && <p className="text-center mt-4 text-blue-700">{message}</p>}
            </form>
        </div>
    );
};


const ManageContent = ({ db, projects, fetchProjects }) => {
    const [editingProject, setEditingProject] = useState(null);
    const [message, setMessage] = useState('');
    const [licensesPdfUrl, setLicensesPdfUrl] = useState('');
    const [internshipsPdfUrl, setInternshipsPdfUrl] = useState('');

    if (editingProject) {
        return <ProjectForm db={db} fetchProjects={fetchProjects} existingProject={editingProject} onDone={() => setEditingProject(null)} />;
    }

    const handleDeleteClick = async (projectId) => {
        if (window.confirm('Are you sure?')) {
            setMessage('Deleting...');
            try {
                await deleteDoc(doc(db, 'projects', projectId));
                setMessage('Project deleted.');
                fetchProjects();
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleUpdatePdfLink = async (e, pdfUrl, docId) => {
        e.preventDefault();
        setMessage(`Updating ${docId}...`);
        try {
            await setDoc(doc(db, "portfolioAssets", docId), { pdfUrl });
            setMessage(`${docId} link updated.`);
            if (docId === 'licenses') setLicensesPdfUrl('');
            if (docId === 'internships') setInternshipsPdfUrl('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl glass-card lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Projects</h2>
                <button onClick={() => setEditingProject({})} className="btn-primary mb-4">Add New Project</button>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    <AnimatePresence>
                        {projects.map(p => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="flex justify-between items-center bg-white/50 p-3 rounded-lg"
                            >
                                <span className="text-gray-700 font-medium">{p.title}</span>
                                <div className="flex gap-4">
                                    <button onClick={() => setEditingProject(p)} className="text-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteClick(p.id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-8 rounded-2xl glass-card">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Update PDFs</h2>
                 <form onSubmit={(e) => handleUpdatePdfLink(e, licensesPdfUrl, 'licenses')} className="space-y-4 mb-6">
                     <input type="url" placeholder="Licenses & Certs PDF Link" value={licensesPdfUrl} onChange={e => setLicensesPdfUrl(e.target.value)} className="input-field" required/>
                     <button type="submit" className="btn-primary w-full">Update Licenses</button>
                 </form>
                 <form onSubmit={(e) => handleUpdatePdfLink(e, internshipsPdfUrl, 'internships')} className="space-y-4">
                     <input type="url" placeholder="Internships PDF Link" value={internshipsPdfUrl} onChange={e => setInternshipsPdfUrl(e.target.value)} className="input-field" required/>
                     <button type="submit" className="btn-primary w-full">Update Internships</button>
                 </form>
            </div>
            {message && <p className="text-center p-3 rounded-lg bg-blue-500/10 text-blue-700 lg:col-span-2">{message}</p>}
        </div>
    );
};


const AdminPanel = ({ db, projects, fetchProjects }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = (success) => {
        setIsAuthenticated(success);
        if (!success) setMessage('Incorrect password.');
    };

    return (
      <div className="bg-[#fdfcf9] min-h-screen">
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">Admin Dashboard</h1>
            {!isAuthenticated ? (
                <AdminLogin onLogin={handleLogin} message={message} />
            ) : (
                <ManageContent db={db} projects={projects} fetchProjects={fetchProjects} />
            )}
        </div>
      </div>
    );
};

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

// --- MAIN APP COMPONENT ---
function App() {
    const [page, setPage] = useState('home');
    const [projects, setProjects] = useState([]);
    const [licensesPdfUrl, setLicensesPdfUrl] = useState('');
    const [internshipsPdfUrl, setInternshipsPdfUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAllData = async () => {
        try {
            // Fetch projects
            const projectsSnapshot = await getDocs(collection(db, 'projects'));
            const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);

            // Fetch PDF links
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
        handleHashChange(); // Initial check

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (loading) return <LoadingSpinner />;

    const renderPage = () => {
        if (page === 'admin') {
            return <AdminPanel db={db} projects={projects} fetchProjects={fetchAllData} />;
        }
        return (
            <>
                <Header />
                <main className="relative z-10">
                    <Hero />
                    <div className="container mx-auto px-6">
                        <About />
                        <SectionSeparator />
                        <Experience />
                        <SectionSeparator />
                        <Skills />
                        <SectionSeparator />
                        <Projects projects={projects} />
                        <SectionSeparator />
                        <Certifications licensesPdfUrl={licensesPdfUrl} internshipsPdfUrl={internshipsPdfUrl} />
                    </div>
                </main>
                <Contact />
            </>
        );
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="bg-[#fdfcf9] text-gray-800 font-sans">
                <GlobalStyles />
                {renderPage()}
            </div>
        </LazyMotion>
    );
}

export default App;