// =================================================================================
// FILE: src/components/AdminPanel.jsx
// =================================================================================
// This component provides a secure admin interface for managing portfolio content.
// It handles user authentication and CRUD operations for projects, skills, and assets.
// All sub-components are memoized for performance.
// =================================================================================

import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Note: db and auth are passed down as props from App.jsx

// --- SUB-COMPONENTS ---

const AdminLogin = React.memo(({ onLogin, auth }) => { /* ... existing AdminLogin code ... */ });
const ProjectForm = React.memo(({ db, fetchProjects, existingProject, onDone }) => { /* ... existing ProjectForm code ... */ });

// NEW: Form for adding or editing a skill
const SkillForm = React.memo(({ db, fetchAllData, existingSkill, categories, onDone }) => {
    const [skill, setSkill] = useState({
        name: existingSkill?.name || '',
        level: existingSkill?.level || 80,
    });
    const [category, setCategory] = useState(existingSkill?.category || categories[0] || '');
    const [newCategory, setNewCategory] = useState('');
    const [message, setMessage] = useState('');
    const isEditing = !!existingSkill?.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSkill(prev => ({ ...prev, [name]: name === 'level' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalCategory = newCategory.trim() || category;
        if (!skill.name || !finalCategory) {
            setMessage('Skill name and category are required.');
            return;
        }

        setMessage(isEditing ? 'Updating skill...' : 'Adding skill...');
        
        try {
            // Firestore logic for skills (assuming skills are stored in a 'skills' collection)
            // This is a simplified example. A more robust solution might involve subcollections.
            // For now, we'll assume a single document per skill.
            const skillData = { ...skill, category: finalCategory };

            if (isEditing) {
                await updateDoc(doc(db, 'skills', existingSkill.id), skillData);
            } else {
                await addDoc(collection(db, 'skills'), skillData);
            }

            setMessage(`Skill ${isEditing ? 'updated' : 'added'} successfully!`);
            fetchAllData(); // Refetch all data to update the UI
            setTimeout(() => onDone(), 1500);

        } catch (error) {
            console.error("Error saving skill:", error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-8 rounded-2xl glass-card">
            <div className="glow-effect"></div>
            <h2 className="text-2xl font-bold text-[#334155] mb-6">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Skill Name (e.g., Python)" value={skill.name} onChange={handleChange} className="input-field" required />
                
                <div>
                    <label className="block text-sm font-medium text-[#4b5563] mb-1">Proficiency Level: {skill.level}%</label>
                    <input type="range" name="level" min="1" max="100" value={skill.level} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>

                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input type="text" name="newCategory" placeholder="Or create a new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="input-field" />
                
                <button type="submit" className="btn-primary w-full">{isEditing ? 'Update Skill' : 'Add Skill'}</button>
                <button type="button" onClick={onDone} className="btn-secondary w-full">Cancel</button>
                {message && <p className="text-center mt-4 text-[#2563eb]">{message}</p>}
            </form>
        </div>
    );
});

const ManageContent = React.memo(({ db, projects, skills, fetchAllData, auth }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const [editingProject, setEditingProject] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);
    const [message, setMessage] = useState('');
    
    // Extract unique categories from the skills data
    const skillCategories = [...new Set(skills.map(s => s.category))];

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (editingProject) return <ProjectForm db={db} fetchProjects={fetchAllData} existingProject={editingProject} onDone={() => setEditingProject(null)} />;
    if (editingSkill) return <SkillForm db={db} fetchAllData={fetchAllData} existingSkill={editingSkill} categories={skillCategories} onDone={() => setEditingSkill(null)} />;
    
    const handleDelete = async (collectionName, id, itemName) => {
        if (!window.confirm(`Are you sure you want to delete this ${itemName}?`)) return;
        setMessage(`Deleting ${itemName}...`);
        try {
            await deleteDoc(doc(db, collectionName, id));
            setMessage(`${itemName} deleted successfully.`);
            fetchAllData();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleLogout = async () => { /* ... existing logout code ... */ };

    return (
        <div>
            <div className="flex justify-center border-b border-gray-300 mb-8">
                <button onClick={() => setActiveTab('projects')} className={`py-2 px-6 font-semibold ${activeTab === 'projects' ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-500'}`}>Manage Projects</button>
                <button onClick={() => setActiveTab('skills')} className={`py-2 px-6 font-semibold ${activeTab === 'skills' ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-500'}`}>Manage Skills</button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {activeTab === 'projects' && (
                        <div className="p-8 rounded-2xl glass-card">
                            <div className="glow-effect"></div>
                            <h2 className="text-2xl font-bold text-[#334155] mb-6">Projects</h2>
                            <button onClick={() => setEditingProject({})} className="btn-primary mb-4">Add New Project</button>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {projects.map(p => (
                                    <motion.div key={p.id} layout className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                                        <span>{p.title}</span>
                                        <div>
                                            <button onClick={() => setEditingProject(p)} className="text-[#2563eb] hover:underline mr-4">Edit</button>
                                            <button onClick={() => handleDelete('projects', p.id, 'project')} className="text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="p-8 rounded-2xl glass-card">
                             <div className="glow-effect"></div>
                            <h2 className="text-2xl font-bold text-[#334155] mb-6">Skills</h2>
                            <button onClick={() => setEditingSkill({})} className="btn-primary mb-4">Add New Skill</button>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {skills.map(s => (
                                     <motion.div key={s.id} layout className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                                        <span>{s.name} ({s.category})</span>
                                        <div>
                                            <button onClick={() => setEditingSkill(s)} className="text-[#2563eb] hover:underline mr-4">Edit</button>
                                            <button onClick={() => handleDelete('skills', s.id, 'skill')} className="text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            
            <div className="mt-8">
                {message && <p className="text-center p-3 rounded-lg bg-[#dbeafe] text-[#1e3a8a] font-medium mb-4">{message}</p>}
                <div className="flex justify-end">
                    <button onClick={handleLogout} className="btn-secondary">Logout</button>
                </div>
            </div>
        </div>
    );
});

// --- MAIN ADMINPANEL COMPONENT ---
const AdminPanel = ({ db, projects, skills, fetchAllData, auth }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return unsubscribe;
    }, [auth]);

    return (
        <div className="bg-[#f5f7fa] min-h-screen">
            <div className="container mx-auto px-6 py-12">
                {!isAuthenticated ? (
                    <AdminLogin onLogin={setIsAuthenticated} auth={auth} />
                ) : (
                    <>
                        <h1 className="text-4xl font-bold text-[#334155] text-center mb-12">Admin Dashboard</h1>
                        <ManageContent db={db} projects={projects} skills={skills} fetchAllData={fetchAllData} auth={auth} />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;