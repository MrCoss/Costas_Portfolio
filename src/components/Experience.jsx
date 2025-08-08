// =================================================================================
// FILE: src/Experience.jsx
// =================================================================================
// This component renders the professional experience section using a vertical
// timeline format. It is composed of reusable TimelineItem sub-components.
// All components are memoized for performance.
// =================================================================================

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

// The TimelineItem is a sub-component used to display each individual job or role.
const TimelineItem = React.memo(({ date, title, company, details }) => (
    <motion.div
        whileHover={{ x: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative pl-8 py-4 border-l-2 border-[#a5b4fc]"
    >
        <div className="absolute -left-[11px] top-6 w-5 h-5 bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] rounded-full border-4 border-white"></div>
        <p className="text-[#64748b] mb-1 font-medium">{date}</p>
        <h3 className="text-2xl font-bold text-[#334155]">{title}</h3>
        <p className="text-lg text-[#2563eb] font-semibold mb-3">{company}</p>
        <ul className="list-disc list-inside text-[#4b5563] space-y-2">
            {details.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </motion.div>
));

// The main Experience component that assembles the timeline.
const Experience = React.memo(() => {
    return (
        <AnimatedSection id="experience">
            <h2 className="text-4xl font-bold text-[#334155] text-center">Experience</h2>
            <AnimatedDivider />
            <div className="max-w-3xl mx-auto space-y-12">
                <TimelineItem
                    date="2024 - Present" // Updated for currency
                    title="Data Analyst Intern"
                    company="SkillFied Mentor (Remote)"
                    details={[
                        "Collected, cleaned, and preprocessed datasets from diverse sources.",
                        "Performed exploratory data analysis (EDA) using Python, Excel, and Power BI.",
                        "Generated actionable insights to support internal strategy and client deliverables."
                    ]}
                />
                <TimelineItem
                    date="2022 - Present"
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
});

export default Experience;