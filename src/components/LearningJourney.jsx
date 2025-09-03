// =================================================================================
// FILE: src/components/LearningJourney.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a consistent and fully semantic color palette
// for a seamless dark mode experience and a more maintainable structure.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

// =================================================================================
// Sub-component: JourneyTimelineItem (Refactored for Semantic Dark Mode)
// =================================================================================
const JourneyTimelineItem = React.memo(({ year, title, details, icon }) => (
    <motion.div
        // MODIFIED: Use semantic border colors.
        className="relative pl-12 py-4 border-l-2 border-primary-light/20 dark:border-primary-dark/20"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
    >
        {/* MODIFIED: Use semantic background and border colors for the icon container. */}
        <div className="absolute -left-[26px] top-4 w-12 h-12 bg-background-light dark:bg-background-dark rounded-full border-4 border-primary-light/20 dark:border-primary-dark/20 flex items-center justify-center shadow-md">
            {icon}
        </div>
        {/* MODIFIED: Use semantic text color for the year. */}
        <p className="text-secondary-light dark:text-secondary-dark mb-1 font-semibold">{year}</p>
        {/* MODIFIED: Use semantic text colors for title and details. */}
        <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{title}</h3>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">{details}</p>
    </motion.div>
));

// =================================================================================
// Main Component: LearningJourney (Refactored for Semantic Dark Mode)
// =================================================================================
const LearningJourney = React.memo(() => {
    // MODIFIED: SVG icons now have semantic color variants.
    const journeyData = [
        {
            year: "2023",
            title: "Foundation & Exploration",
            details: "Built a strong programming foundation in Python and Java while exploring front-end development. Developed and trained my first predictive models, sparking a passion for machine learning.",
            icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        },
        {
            year: "2024",
            title: "Accelerated Growth & Specialization",
            details: "Completed over 60 certifications from industry leaders like Google, IBM, and Meta, specializing in AI, Data Science, and Full-Stack Development to deepen my expertise.",
            icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
        },
        {
            year: "Ongoing",
            title: "Application & Innovation",
            details: "Actively applying knowledge through internships and real-world projects. Continuously exploring new AI architectures and contributing to open-source repositories to stay at the forefront of technology.",
            icon: <svg className="w-6 h-6 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        }
    ];

    return (
        <AnimatedSection id="journey">
            {/* MODIFIED: Heading now uses semantic text color tokens. */}
            <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">My Learning Journey</h2>
            <AnimatedDivider />
            {/*
              MODIFIED: Glass card now uses semantic colors and hover effects.
              Removed redundant dark shadow class.
            */}
            <div className="relative p-8 md:p-12 max-w-4xl mx-auto rounded-2xl bg-white/20 dark:bg-background-alt-dark/20 backdrop-blur-lg border border-white/30 dark:border-white/10 shadow-lg shadow-primary-light/10 dark:shadow-primary-dark/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-light/20 dark:hover:shadow-primary-dark/20 hover:-translate-y-1">
                <div className="space-y-12">
                    {journeyData.map((item) => (
                        <JourneyTimelineItem key={item.title} {...item} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
});

export default LearningJourney;