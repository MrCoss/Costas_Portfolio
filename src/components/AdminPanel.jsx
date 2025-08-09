// =================================================================================
// FILE: src/components/AdminPanel.jsx
// =================================================================================
// This component provides a complete admin interface for managing portfolio content.
// It handles user authentication (Firebase Auth), project management (Firestore),
// and file uploads for project images and certification PDFs (Firebase Storage).
// =================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Use a CDN URL to resolve the module import error for react-icons
import { FaEnvelope, FaLock, FaExternalLinkAlt, FaFileUpload, FaImage, FaTrash, FaEdit, FaTimes } from 'https://esm.sh/react-icons@5.2.1/fa';

// --- SUB-COMPONENTS ---

// 1. LOGIN COMPONENT
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
                className="p-8 rounded-2xl bg-white shadow-2xl border border-slate-200/50"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-700">Admin Access</h2>
                    <p className="text-slate-500 mt-2">Log in to manage your portfolio.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" required disabled={submitting} />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12" required disabled={submitting} />
                    </div>
                    <button type="submit" className="btn-primary w-full !py-3 !text-base" disabled={submitting}>
                        {submitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-red-500 bg-red-100 p-3 rounded-lg">{message}</p>}
            </motion.div>
        </div>
    );
});

// 2. PROJECT FORM (ADD/EDIT)
const ProjectForm = React.memo(({ db, storage, fetchProjects, existingProject, onDone }) => {
    const [project, setProject] = useState({
        title: existingProject?.title || '',
        description: existingProject?.description || '',
        skills: existingProject?.skills?.join(', ') || '',
        imageUrl: existingProject?.imageUrl || '',
        imagePath: existingProject?.imagePath || '', // To track the image in storage for deletion
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isEditing = !!existingProject?.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setUploadProgress(0);

        let imageUrl = project.imageUrl;
        let imagePath = project.imagePath;

        try {
            // Step 1: Upload new image if one is selected
            if (imageFile) {
                // If editing and there's an old image, delete it first
                if (isEditing && project.imagePath) {
                    const oldImageRef = ref(storage, project.imagePath);
                    try {
                        await deleteObject(oldImageRef);
                    } catch (deleteError) {
                        // Log error but continue, maybe the file was already deleted
                        console.warn("Could not delete old image, it may not exist:", deleteError);
                    }
                }
                
                const newImagePath = `projects/${Date.now()}_${imageFile.name}`;
                const storageRef = ref(storage, newImagePath);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                        (error) => reject(error),
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            imagePath = newImagePath;
                            resolve();
                        }
                    );
                });
            }

            // Step 2: Prepare project data for Firestore
            const projectData = {
                ...project,
                skills: project.skills.split(',').map(tag => tag.trim()).filter(tag => tag),
                imageUrl,
                imagePath,
            };

            // Step 3: Add or Update document in Firestore
            if (isEditing) {
                await updateDoc(doc(db, 'projects', existingProject.id), projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }

            setMessage(`Project ${isEditing ? 'updated' : 'added'} successfully!`);
            fetchProjects();
            setTimeout(() => onDone(), 1500);

        } catch (error) {
            console.error("Error saving project:", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 rounded-2xl bg-white shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Project Title" value={project.title} onChange={handleChange} className="input-field" required />
                <textarea name="description" placeholder="Project Description" value={project.description} onChange={handleChange} className="input-field h-32" required />
                <input type="text" name="skills" placeholder="Skills (comma-separated, e.g., React, Firebase)" value={project.skills} onChange={handleChange} className="input-field" />
                
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Project Photo</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {project.imageUrl && !imageFile && <img src={project.imageUrl} alt="Current" className="w-24 h-24 object-cover mt-2 rounded-md"/>}
                </div>
                
                {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Add Project')}</button>
                    <button type="button" onClick={onDone} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
                </div>
                {message && <p className="text-center mt-4 text-blue-600">{message}</p>}
            </form>
        </div>
    );
});

// 3. ASSET MANAGER FORM (PDF UPLOAD/LINK)
const AssetManagerForm = React.memo(({ db, storage, fetchAllData, initialData, onDone }) => {
    const [uploadTypes, setUploadTypes] = useState({ licenses: 'link', internships: 'link' });
    const [files, setFiles] = useState({ licenses: null, internships: null });
    const [urls, setUrls] = useState({
        licensesPdfUrl: initialData.licensesPdfUrl || '',
        internshipsPdfUrl: initialData.internshipsPdfUrl || '',
    });
    const [progress, setProgress] = useState({ licenses: 0, internships: 0 });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleFileUpload = (asset, file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(urls[`${asset}PdfUrl`]);
                return;
            }

            const storagePath = `certifications/${asset}_${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => setProgress(p => ({...p, [asset]: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 })),
                (error) => reject(error),
                () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('Processing updates...');
        try {
            const [licensesPdfUrl, internshipsPdfUrl] = await Promise.all([
                uploadTypes.licenses === 'upload' ? handleFileUpload('licenses', files.licenses) : Promise.resolve(urls.licensesPdfUrl),
                uploadTypes.internships === 'upload' ? handleFileUpload('internships', files.internships) : Promise.resolve(urls.internshipsPdfUrl)
            ]);
            
            await setDoc(doc(db, 'portfolioAssets', 'main'), { licensesPdfUrl, internshipsPdfUrl }, { merge: true });

            setMessage('Assets updated successfully!');
            fetchAllData();
            setTimeout(() => onDone(), 1500);

        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const renderAssetInput = (assetName, label) => (
        <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
            <div className="flex gap-4 mb-3">
                <button type="button" onClick={() => setUploadTypes(p => ({...p, [assetName]: 'link'}))} className={`btn-tab ${uploadTypes[assetName] === 'link' ? 'active' : ''}`}><FaExternalLinkAlt /> Link</button>
                <button type="button" onClick={() => setUploadTypes(p => ({...p, [assetName]: 'upload'}))} className={`btn-tab ${uploadTypes[assetName] === 'upload' ? 'active' : ''}`}><FaFileUpload /> Upload</button>
            </div>
            {uploadTypes[assetName] === 'link' ? (
                <input type="url" name={`${assetName}PdfUrl`} placeholder="External PDF Link" value={urls[`${assetName}PdfUrl`]} onChange={(e) => setUrls(p => ({...p, [e.target.name]: e.target.value}))} className="input-field" />
            ) : (
                <>
                    <input type="file" accept="application/pdf" onChange={(e) => setFiles(p => ({...p, [assetName]: e.target.files[0]}))} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {progress[assetName] > 0 && <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress[assetName]}%` }}></div></div>}
                </>
            )}
            {urls[`${assetName}PdfUrl`] && <a href={urls[`${assetName}PdfUrl`]} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">View Current PDF</a>}
        </div>
    );

    return (
        <div className="p-8 rounded-2xl bg-white shadow-xl">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Manage Certification PDFs</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {renderAssetInput('licenses', 'Certifications PDF')}
                {renderAssetInput('internships', 'Internships PDF')}
                <div className="flex gap-4 pt-4">
                    <button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? 'Updating...' : 'Update Assets'}</button>
                    <button type="button" onClick={onDone} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
                </div>
                {message && <p className="text-center mt-4 text-blue-600">{message}</p>}
            </form>
        </div>
    );
});

// 4. MAIN DASHBOARD VIEW
const ManageContent = React.memo(({ db, storage, auth, projects, fetchAllData, licensesPdfUrl, internshipsPdfUrl }) => {
    const [activeTab, setActiveTab] = useState('projects');
    const [editingItem, setEditingItem] = useState(null); // { type: 'project' | 'asset', data: {} }
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleLogout = useCallback(async () => {
        try { await signOut(auth); } catch (error) { console.error("Logout error:", error); }
    }, [auth]);

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            // Also delete the associated image from storage if it's a project
            if(itemToDelete.type === 'project' && itemToDelete.data.imagePath) {
                const imageRef = ref(storage, itemToDelete.data.imagePath);
                await deleteObject(imageRef);
            }
            await deleteDoc(doc(db, itemToDelete.collection, itemToDelete.data.id));
            fetchAllData();
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setItemToDelete(null);
        }
    };
    
    // Render the correct form based on editingItem state
    if (editingItem?.type === 'project') {
        return <ProjectForm db={db} storage={storage} fetchProjects={fetchAllData} existingProject={editingItem.data} onDone={() => setEditingItem(null)} />;
    }
    if (editingItem?.type === 'asset') {
        return <AssetManagerForm db={db} storage={storage} fetchAllData={fetchAllData} initialData={{ licensesPdfUrl, internshipsPdfUrl }} onDone={() => setEditingItem(null)} />;
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-700">Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>

            <div className="flex justify-center border-b border-gray-200 mb-8">
                <button onClick={() => setActiveTab('projects')} className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}>Manage Projects</button>
                <button onClick={() => setActiveTab('assets')} className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}>Manage Assets</button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {activeTab === 'projects' && (
                        <div>
                            <button onClick={() => setEditingItem({ type: 'project', data: null })} className="btn-primary mb-4">Add New Project</button>
                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                                {projects?.map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded-md" />
                                            <span className="font-semibold">{p.title}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => setEditingItem({ type: 'project', data: p })} className="text-blue-500 hover:text-blue-700"><FaEdit size={20} /></button>
                                            <button onClick={() => setItemToDelete({ type: 'project', collection: 'projects', data: p })} className="text-red-500 hover:text-red-700"><FaTrash size={20} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'assets' && (
                        <div className="text-center">
                            <p className="text-slate-600 mb-4">Update the links or upload new PDF files for your certifications and internships.</p>
                            <button onClick={() => setEditingItem({ type: 'asset' })} className="btn-primary w-full max-w-xs mx-auto">Update Asset PDFs</button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
                            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete "{itemToDelete.data.title}"? This cannot be undone.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={handleDelete} className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600">Delete</button>
                                <button onClick={() => setItemToDelete(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

// 5. TOP-LEVEL ADMIN PANEL COMPONENT
const AdminPanel = ({ db, auth, storage }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState({ projects: [], licensesPdfUrl: '', internshipsPdfUrl: '' });

    const fetchAllData = useCallback(async () => {
        if (!db) return;
        try {
            const projectsSnapshot = await getDocs(collection(db, "projects"));
            const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const assetsDoc = await getDocs(collection(db, "portfolioAssets"));
            const assetsData = assetsDoc.docs[0]?.data() || {};

            setPortfolioData({ 
                projects, 
                licensesPdfUrl: assetsData.licensesPdfUrl || '', 
                internshipsPdfUrl: assetsData.internshipsPdfUrl || '' 
            });
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
        }
    }, [db]);

    useEffect(() => {
        if (!auth) {
            setIsLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            if (user) {
                fetchAllData();
            }
            setIsLoading(false);
        });
        return unsubscribe;
    }, [auth, fetchAllData]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4">
            <div className="container mx-auto">
                {!isAuthenticated ? (
                    <AdminLogin onLogin={setIsAuthenticated} auth={auth} />
                ) : (
                    <ManageContent 
                        db={db} 
                        storage={storage}
                        auth={auth}
                        projects={portfolioData.projects}
                        licensesPdfUrl={portfolioData.licensesPdfUrl}
                        internshipsPdfUrl={portfolioData.internshipsPdfUrl}
                        fetchAllData={fetchAllData}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
