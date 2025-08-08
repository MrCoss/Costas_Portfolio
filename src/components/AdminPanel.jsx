import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

// Note: db and auth are passed down as props from App.jsx

const AdminLogin = React.memo(({ onLogin, message, auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState(message);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginMessage('Logging in...');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoginMessage('Login successful!');
            onLogin(true);
        } catch (error) {
            console.error("Login error:", error);
            setLoginMessage(`Login failed: ${error.message}`);
            onLogin(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
            <form onSubmit={handleLogin} className="p-8 rounded-2xl w-full max-w-sm glass-card">
                <div className="glow-effect"></div>
                <h2 className="text-2xl font-bold text-[#334155] text-center mb-6">Admin Login</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-field mb-4" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field mb-4" required />
                <button type="submit" className="btn-primary w-full">Login</button>
                {loginMessage && <p className="text-red-500 text-center mt-4">{loginMessage}</p>}
            </form>
        </div>
    );
});

const ProjectForm = React.memo(({ db, fetchProjects, existingProject, onDone }) => {
    const [project, setProject] = useState({
        title: existingProject?.title || '',
        description: existingProject?.description || '',
        tags: Array.isArray(existingProject?.tags) ? existingProject.tags.join(', ') : existingProject?.tags || '',
        projectLink: existingProject?.projectLink || '',
        imageUrl: existingProject?.imageUrl || '',
    });
    const [message, setMessage] = useState('');
    const isEditing = !!existingProject?.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(isEditing ? 'Updating...' : 'Adding...');
        const tagsArray = (project.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
        const projectData = { ...project, tags: tagsArray };

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
            <div className="glow-effect"></div>
            <h2 className="text-2xl font-bold text-[#334155] mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} className="input-field" required />
                <textarea name="description" placeholder="Description" value={project.description} onChange={handleChange} className="input-field" required />
                <input type="text" name="tags" placeholder="Tags (comma-separated)" value={project.tags} onChange={handleChange} className="input-field" />
                <label className="block text-sm font-medium text-[#4b5563] mt-4">
                    Image URL (e.g., Imgur)
                    <input type="url" name="imageUrl" placeholder="Paste image link here" value={project.imageUrl} onChange={handleChange} className="input-field" />
                </label>
                <button type="submit" className="btn-primary w-full">{isEditing ? 'Update Project' : 'Add Project'}</button>
                <button type="button" onClick={onDone} className="btn-secondary w-full">Cancel</button>
                {message && <p className="text-center mt-4 text-[#2563eb]">{message}</p>}
            </form>
        </div>
    );
});

const ManageContent = React.memo(({ db, projects, fetchProjects, auth }) => {
    const [editingProject, setEditingProject] = useState(null);
    const [message, setMessage] = useState('');
    const [licensesPdfUrl, setLicensesPdfUrl] = useState('');
    const [internshipsPdfUrl, setInternshipsPdfUrl] = useState('');

    // UPDATE: Messages now auto-dismiss after 4 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (editingProject) {
        return <ProjectForm db={db} fetchProjects={fetchProjects} existingProject={editingProject} onDone={() => setEditingProject(null)} />;
    }

    const handleDeleteClick = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        setMessage('Deleting...');
        try {
            await deleteDoc(doc(db, 'projects', projectId));
            setMessage('Project deleted successfully.');
            fetchProjects();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleUpdatePdfLink = async (e, pdfUrl, docId) => {
        e.preventDefault();
        if (!pdfUrl) return;
        setMessage(`Updating ${docId}...`);
        try {
            await setDoc(doc(db, "portfolioAssets", docId), { pdfUrl });
            setMessage(`${docId} link updated successfully!`);
            if (docId === 'licenses') setLicensesPdfUrl('');
            if (docId === 'internships') setInternshipsPdfUrl('');
            fetchProjects();
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.hash = '';
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl glass-card lg:col-span-2">
                <div className="glow-effect"></div>
                <h2 className="text-2xl font-bold text-[#334155] mb-6">Manage Projects</h2>
                <button onClick={() => setEditingProject({})} className="btn-primary mb-4">Add New Project</button>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    <AnimatePresence>
                        {projects.map(p => (
                            <motion.div key={p.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                                <span className="text-[#4b5563] font-medium">{p.title}</span>
                                <div className="flex gap-4">
                                    <button onClick={() => setEditingProject(p)} className="text-[#2563eb] hover:underline">Edit</button>
                                    <button onClick={() => handleDeleteClick(p.id)} className="text-red-500 hover:underline">Delete</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            
            <div className="p-8 rounded-2xl glass-card">
                <div className="glow-effect"></div>
                <h2 className="text-2xl font-bold text-[#334155] mb-6">Update Certificate PDFs</h2>
                <form onSubmit={(e) => handleUpdatePdfLink(e, licensesPdfUrl, 'licenses')} className="space-y-4 mb-6">
                    <input type="url" placeholder="Licenses & Certs PDF Link" value={licensesPdfUrl} onChange={e => setLicensesPdfUrl(e.target.value)} className="input-field" required />
                    <button type="submit" className="btn-primary w-full">Update Licenses</button>
                </form>
                <form onSubmit={(e) => handleUpdatePdfLink(e, internshipsPdfUrl, 'internships')} className="space-y-4">
                    <input type="url" placeholder="Internships PDF Link" value={internshipsPdfUrl} onChange={e => setInternshipsPdfUrl(e.target.value)} className="input-field" required />
                    <button type="submit" className="btn-primary w-full">Update Internships</button>
                </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                    {message && 
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center p-3 rounded-lg bg-[#dbeafe] text-[#1e3a8a] font-medium"
                        >
                            {message}
                        </motion.p>
                    }
                </AnimatePresence>
                <div className="flex justify-end">
                    <button onClick={handleLogout} className="btn-secondary">Logout</button>
                </div>
            </div>
        </div>
    );
});

const AdminPanel = ({ db, projects, fetchProjects, auth }) => {
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
                        <ManageContent db={db} projects={projects} fetchProjects={fetchProjects} auth={auth} />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;