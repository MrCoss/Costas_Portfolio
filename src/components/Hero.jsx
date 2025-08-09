// =================================================================================
// FILE: src/Hero.jsx
// =================================================================================
// This component renders a highly animated and interactive hero section.
// It uses framer-motion, react-type-animation, and an updated @tsparticles/react
// configuration for a more dynamic "plexus" background effect.
// =================================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
// Use CDN URLs to resolve module import errors in build environments
import { TypeAnimation } from 'https://esm.sh/react-type-animation@3.2.0';
import Particles, { initParticlesEngine } from "https://esm.sh/@tsparticles/react@3.0.0";
import { loadSlim } from "https://esm.sh/@tsparticles/slim@3.4.0";
import { FaLinkedin, FaGithub, FaDownload } from 'https://esm.sh/react-icons@5.2.1/fa';
// Correct the relative path to go up one directory from 'components' to 'src'
import heroImage from '../assets/Hero.png';


const Hero = React.memo(() => {
    const [init, setInit] = useState(false);

    // Modern initialization for tsparticles
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Memoize options to prevent re-creation on every render
    const particlesOptions = useMemo(() => ({
        background: {
            color: { value: 'transparent' },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { enable: true, mode: 'grab' }, // Changed to 'grab' for a different effect
                resize: true,
            },
            modes: {
                grab: {
                    distance: 200,
                    links: { opacity: 0.8 }
                },
            },
        },
        particles: {
            color: { value: '#a1a1aa' },
            links: {
                color: '#a1a1aa',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: { default: 'bounce' },
                random: false,
                speed: 2, // Slightly increased speed
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 100, // Increased particle count
            },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } }, // Smaller particle size
        },
        detectRetina: true,
    }), []);

    // Framer Motion variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };
    
    return (
        <section id="home" className="min-h-screen flex items-center justify-center text-center md:text-left relative overflow-hidden bg-slate-50">
            {/* Particle Background - Conditionally rendered */}
            {init && (
                <Particles
                    id="tsparticles"
                    options={particlesOptions}
                    className="absolute top-0 left-0 w-full h-full z-0"
                />
            )}
            
            <div className="container mx-auto px-6 py-20 grid md:grid-cols-5 gap-8 items-center relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:col-span-3">
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-4">
                        <span className="block mb-2 text-xl font-medium text-slate-500">Hello, I'm</span>
                        Costas Pinto
                    </motion.h1>
                    
                    <motion.div variants={itemVariants}>
                        <TypeAnimation
                            sequence={[ 'AI Innovator', 2000, 'Full-Stack Developer', 2000, 'Data Scientist', 2000, 'Problem Solver', 2000 ]}
                            wrapper="p"
                            speed={50}
                            className="text-2xl md:text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 h-10"
                            repeat={Infinity}
                        />
                    </motion.div>
                    
                    <motion.p variants={itemVariants} className="max-w-xl text-slate-600 leading-relaxed mb-8 mx-auto md:mx-0">
                        Transforming raw data into actionable insights. I build intelligent systems and solve complex problems with a passion for machine learning and data visualization.
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
                        <motion.a
                            href="/CostasPinto_CV.pdf"
                            download="CostasPinto_CV.pdf"
                            whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(37, 99, 235, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
                        >
                            <FaDownload />
                            Download CV
                        </motion.a>
                        <div className="flex gap-4">
                            <motion.a whileHover={{ y: -3 }} href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                                <FaLinkedin size={32} />
                            </motion.a>
                            <motion.a whileHover={{ y: -3 }} href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800 transition-colors">
                                <FaGithub size={32} />
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                    transition={{ opacity: { duration: 0.8, delay: 0.4 }, scale: { duration: 0.8, delay: 0.4, type: 'spring' }, y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
                    className="md:col-span-2 flex justify-center items-center"
                >
                    <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                            transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
                            className="absolute inset-0 bg-gradient-to-tr from-blue-200 via-indigo-200 to-blue-300 rounded-full opacity-50 blur-3xl"
                        />
                        <div className="relative z-10 flex justify-center items-center h-full">
                            <img
                                loading="lazy"
                                src={heroImage}
                                onError={(e) => { e.target.src = 'https://placehold.co/400x400/e2e8f0/334155?text=CP'; }}
                                alt="Costas Pinto"
                                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-contain"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

export default Hero;
