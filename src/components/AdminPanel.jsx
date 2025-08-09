// =================================================================================
// FILE: src/components/AdminPanel.jsx
// =================================================================================
// This component provides a secure admin interface for managing portfolio content.
// It handles user authentication and CRUD operations for projects, skills, and assets.
// All sub-components are memoized for performance.
// =================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // <-- Import storage functions
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaExternalLinkAlt, FaFileUpload } from 'react-icons/fa'; // <-- Import icons

// Note: db, auth, and storage are passed down as props from App.jsx

// --- SUB-COMPONENTS ---

// ✨ Revamped AdminLogin component with improved UI
const AdminLogin = React.memo(({ onLogin, auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(true);
        } catch (error) {
            console.error("Login error:", error);
            setMessage('Invalid credentials. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl glass-card shadow-2xl border border-slate-200/50"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-700">Admin Access</h2>
                    <p className="text-slate-500 mt-2">Log in to manage your portfolio.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field pl-12"
                            required
                            disabled={submitting}
                        />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field pl-12"
                            required
                            disabled={submitting}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full !py-3 !text-base" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-4 text-red-500 bg-red-100 p-3 rounded-lg"
                    >
                        {message}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
});


// ... (ProjectForm and SkillForm components remain the same)
const ProjectForm = React.memo(/* ...existing code... */);
const SkillForm = React.memo(/* ...existing code... */);


// ✨ NEW: Upgraded form for managing assets via Link OR Upload
const AssetManagerForm = React.memo(({ db, storage, fetchAllData, initialData, onDone }) => {
    // State for managing upload type, file data, and URLs
    const [uploadTypes, setUploadTypes] = useState({ licenses: 'link', internships: 'link' });
    const [files, setFiles] = useState({ licenses: null, internships: null });
    const [urls, setUrls] = useState({
        licensesPdfUrl: initialData.licensesPdfUrl || '',
        internshipsPdfUrl: initialData.internshipsPdfUrl || '',
    });
    const [progress, setProgress] = useState({ licenses: 0, internships: 0 });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleTypeChange = (asset, type) => {
        setUploadTypes(prev => ({ ...prev, [asset]: type }));
    };

    const handleFileChange = (asset, file) => {
        setFiles(prev => ({ ...prev, [asset]: file }));
    };

    const handleUrlChange = (e) => {
        const { name, value } = e.target;
        setUrls(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (asset, file) => {
        return new Promise((resolve, reject) => {
            if (!file) resolve(urls[`${asset}PdfUrl`]); // No new file, resolve with existing URL

            const storagePath = `certifications/${asset}_${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(p => ({...p, [asset]: prog }));
                },
                (error) => {
                    console.error(`Upload error for ${asset}:`, error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(resolve);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('Processing updates...');
        setProgress({ licenses: 0, internships: 0 });

        try {
            const licensesPromise = uploadTypes.licenses === 'upload'
                ? handleFileUpload('licenses', files.licenses)
                : Promise.resolve(urls.licensesPdfUrl);

            const internshipsPromise = uploadTypes.internships === 'upload'
                ? handleFileUpload('internships', files.internships)
                : Promise.resolve(urls.internshipsPdfUrl);

            const [licensesPdfUrl, internshipsPdfUrl] = await Promise.all([licensesPromise, internshipsPromise]);
            
            const docRef = doc(db, 'portfolioAssets', 'pdfs');
            await setDoc(docRef, { licensesPdfUrl, internshipsPdfUrl }, { merge: true });

            setMessage('Assets updated successfully!');
            fetchAllData();
            setTimeout(() => onDone(), 1500);

        } catch (error) {
            console.error("Error updating assets:", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const renderAssetInput = (assetName, label) => (
        <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-2">{label}</label>
            <div className="flex gap-4 mb-3">
                <button type="button" onClick={() => handleTypeChange(assetName, 'link')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${uploadTypes[assetName] === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <FaExternalLinkAlt /> Link
                </button>
                <button type="button" onClick={() => handleTypeChange(assetName, 'upload')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${uploadTypes[assetName] === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <FaFileUpload /> Upload
                </button>
            </div>
            
            {uploadTypes[assetName] === 'link' ? (
                <input
                    type="url"
                    name={`${assetName}PdfUrl`}
                    placeholder="Google Drive, Dropbox, etc. Link"
                    value={urls[`${assetName}PdfUrl`]}
                    onChange={handleUrlChange}
                    className="input-field"
                />
            ) : (
                <div>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(assetName, e.target.files[0])}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {progress[assetName] > 0 && progress[assetName] < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress[assetName]}%` }}></div>
                        </div>
                    )}
                </div>
            )}
             {urls[`${assetName}PdfUrl`] && <a href={urls[`${assetName}PdfUrl`]} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">View Current PDF</a>}
        </div>
    );

    return (
        <div className="p-8 rounded-2xl glass-card">
            <h2 className="text-2xl font-bold text-[#334155] mb-6">Manage Asset PDFs</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {renderAssetInput('licenses', 'Certifications PDF')}
                {renderAssetInput('internships', 'Internships PDF')}
                
                <button type="submit" className="btn-primary w-full" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Assets'}
                </button>
                <button type="button" onClick={onDone} className="btn-secondary w-full" disabled={submitting}>
                    Cancel
                </button>
                {message && <p className="text-center mt-4 text-[#2563eb]">{message}</p>}
            </form>
        </div>
    );
});


// ... (ManageContent component needs to be updated to use AssetManagerForm and pass `storage`)
const ManageContent = React.memo(({ db, auth, storage, projects, skills, fetchAllData, licensesPdfUrl, internshipsPdfUrl }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const [editingProject, setEditingProject] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);
    const [editingAssets, setEditingAssets] = useState(false); // Changed from editingCertifications
    const [message, setMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const skillCategories = skills ? [...new Set(skills.map(s => s.category))] : [];

    // ... (useEffect and delete logic remains the same)
    
    // Pass `storage` to the form
    if (editingAssets) return <AssetManagerForm db={db} storage={storage} fetchAllData={fetchAllData} initialData={{ licensesPdfUrl, internshipsPdfUrl }} onDone={() => setEditingAssets(false)} />;
    
    // ... (rest of the ManageContent component is mostly the same, just updating the state setter for the certifications tab)

    return (
        <div>
            <div className="flex justify-center border-b border-gray-300 mb-8">
                 <button onClick={() => setActiveTab('projects')} className={`py-2 px-6 font-semibold ${activeTab === 'projects' ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-500'}`}>Manage Projects</button>
                 <button onClick={() => setActiveTab('skills')} className={`py-2 px-6 font-semibold ${activeTab === 'skills' ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-500'}`}>Manage Skills</button>
                 {/* Update tab name */}
                 <button onClick={() => setActiveTab('assets')} className={`py-2 px-6 font-semibold ${activeTab === 'assets' ? 'text-[#2563eb] border-b-2 border-[#2563eb]' : 'text-gray-500'}`}>Manage Assets</button>
            </div>
            
             <AnimatePresence mode="wait">
                 <motion.div key={activeTab} /* ... */ >
                     {/* ... (projects and skills tabs are the same) ... */}
                    
                     {activeTab === 'assets' && (
                        <div className="p-8 rounded-2xl glass-card">
                            <div className="glow-effect"></div>
                            <h2 className="text-2xl font-bold text-[#334155] mb-6">Certifications & Internships</h2>
                            <p className="text-[#4b5563] mb-4">Update the links or upload new PDF files for your assets. Uploaded files will be stored securely.</p>
                            <button onClick={() => setEditingAssets(true)} className="btn-primary w-full">Update Asset PDFs</button>
                        </div>
                     )}
                 </motion.div>
            </AnimatePresence>
            {/* ... (rest of the component is the same) ... */}
        </div>
    );
});


// --- MAIN ADMINPANEL COMPONENT ---
const AdminPanel = ({ db, auth, storage, projects, skills, fetchAllData, licensesPdfUrl, internshipsPdfUrl }) => { // <-- Add storage prop
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (!auth) return;
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
                        {/* Pass storage down */}
                        <ManageContent 
                            db={db} 
                            auth={auth} 
                            storage={storage} 
                            projects={projects} 
                            skills={skills} 
                            fetchAllData={fetchAllData} 
                            licensesPdfUrl={licensesPdfUrl} 
                            internshipsPdfUrl={internshipsPdfUrl} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;