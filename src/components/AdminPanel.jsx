// =================================================================================
// FILE: src/components/AdminPanel.jsx (FINAL & COMPLETE)
// =================================================================================
// This component is fully restored to include all functionality:
// - Admin Login/Logout
// - Adding/Deleting Projects (with a media URL input)
// - Automated fetching of certificate image links from a Google Drive Folder ID
// - Saving the fetched links to Firestore
// =================================================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, doc, getDocs, setDoc, getDoc, serverTimestamp
} from "firebase/firestore";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from "./ui/LoadingSpinner.jsx";

// --- SUB-COMPONENTS (rest of the sub-components are unchanged) ---
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-text-primary-dark transition-opacity duration-300 z-50";
  const typeClasses = type === 'success' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-red-500';
  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold">X</button>
    </div>
  );
};
const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background-light dark:bg-background-alt-dark rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">{title}</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-background-alt-light dark:bg-background-alt-dark hover:bg-slate-300 dark:hover:bg-slate-600 transition text-text-primary-light dark:text-text-primary-dark">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Confirm</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
);

// --- MAIN ADMIN PANEL COMPONENT ---
export default function AdminPanel({ db, auth }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState({ licensesImageUrls: [], internshipsImageUrls: [] });
  const [licensesFolderId, setLicensesFolderId] = useState('');
  const [internshipsFolderId, setInternshipsFolderId] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [modalState, setModalState] = useState({ isOpen: false, onConfirm: () => {} });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", tags: [], mediaUrl: "" });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // REPLACE WITH YOUR PUBLISHED GOOGLE APPS SCRIPT URL
  const APPS_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL"; 

  const showNotification = useCallback((message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      showNotification("Failed to fetch projects.");
    }
  }, [db, showNotification]);

  const fetchAssets = useCallback(async () => {
    try {
      const docRef = doc(db, "portfolioAssets", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssets({
          licensesImageUrls: data.licensesImageUrls || [],
          internshipsImageUrls: data.internshipsImageUrls || []
        });
      }
    } catch (err) {
      showNotification("Failed to fetch asset links.");
    }
  }, [db, showNotification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProjects();
        fetchAssets();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, fetchProjects, fetchAssets]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      showNotification("Login failed: Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      if (!newProject.tags.includes(tagInput.trim())) {
        setNewProject({ ...newProject, tags: [...newProject.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewProject({ ...newProject, tags: newProject.tags.filter(tag => tag !== tagToRemove) });
  };
  
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return showNotification("Project title is required.");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "projects"), { ...newProject, createdAt: serverTimestamp() });
      setNewProject({ title: "", description: "", link: "", tags: [], mediaUrl: "" });
      e.target.reset();
      showNotification("Project added successfully!", "success");
      fetchProjects();
    } catch (err) {
      showNotification("Failed to add project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = (id) => {
    setModalState({
      isOpen: true,
      onConfirm: () => confirmDelete(id),
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this project? This action cannot be undone."
    });
  };

  const confirmDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(prev => prev.filter(p => p.id !== id));
      showNotification("Project deleted successfully.", "success");
    } catch (err) {
      showNotification("Failed to delete project.");
    } finally {
      setModalState({ isOpen: false, onConfirm: () => {} });
    }
  };

  const handleFetchImages = async (folderId, type) => {
    if (!folderId) {
      return showNotification(`Please enter a Folder ID for ${type === 'licenses' ? 'Licenses & Certs' : 'Internships'}.`);
    }
    setIsFetching(true);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?folderId=${folderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from Google Apps Script.');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAssets(prev => ({
        ...prev,
        [type === 'licenses' ? 'licensesImageUrls' : 'internshipsImageUrls']: data.urls
      }));
      showNotification(`Successfully loaded ${data.urls.length} images. Remember to save!`, "success");
    } catch (err) {
      showNotification(`Error fetching images: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAssetUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "portfolioAssets", "main");
      await setDoc(docRef, assets, { merge: true });
      showNotification("Asset links updated successfully!", "success");
    } catch (err) {
      showNotification("Failed to update asset links.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background-alt-light dark:bg-background-alt-dark flex items-center justify-center p-4">
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-background-light dark:bg-background-dark shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition text-text-primary-light dark:text-text-primary-dark" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition text-text-primary-light dark:text-text-primary-dark" required />
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary-light dark:bg-primary-dark text-white dark:text-text-primary-dark px-4 py-3 rounded-lg font-semibold hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition-colors disabled:opacity-50">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <>
      <ConfirmModal isOpen={modalState.isOpen} onConfirm={modalState.onConfirm} onCancel={() => setModalState({ isOpen: false, onConfirm: () => {} })} title={modalState.title} message={modalState.message} />
      <div className="min-h-screen bg-background-alt-light dark:bg-background-alt-dark p-4 sm:p-6 md:p-8">
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">Admin Dashboard</h1>
            <button onClick={handleLogout} className="bg-secondary-light dark:bg-secondary-dark text-white dark:text-text-primary-dark px-5 py-2 rounded-lg font-semibold hover:bg-secondary-hover dark:hover:bg-secondary-dark-hover transition-colors">Logout</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Add New Project</h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                  <textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" rows="3"></textarea>
                  <input type="url" placeholder="Project Link (e.g., GitHub)" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                  <input type="url" placeholder="Project Media URL (e.g., GDrive link)" value={newProject.mediaUrl} onChange={(e) => setNewProject({ ...newProject, mediaUrl: e.target.value })} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                  <div>
                    <input type="text" placeholder="Add skills/tags and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.tags.map(tag => (
                        <span key={tag} className="bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-primary-light/70 dark:text-primary-dark/70 hover:text-primary-light dark:hover:text-primary-dark">x</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary-light dark:bg-primary-dark text-text-primary-dark dark:text-text-primary-light py-2 rounded-lg font-semibold hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition disabled:opacity-50">
                    {isSubmitting ? 'Adding Project...' : 'Add Project'}
                  </button>
                </form>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Manage Asset Links</h2>
                <form onSubmit={handleAssetUpdate} className="space-y-4">
                  <div>
                    <input type="text" placeholder="Licenses Folder ID" value={licensesFolderId} onChange={(e) => setLicensesFolderId(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                    <button type="button" onClick={() => handleFetchImages(licensesFolderId, 'licenses')} disabled={isFetching} className="w-full mt-2 bg-primary-light dark:bg-primary-dark text-white dark:text-text-primary-dark py-2 rounded-lg font-semibold hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition disabled:opacity-50">
                      {isFetching ? 'Fetching...' : 'Fetch Licenses Images'}
                    </button>
                    {assets.licensesImageUrls.length > 0 && (
                      <div className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {assets.licensesImageUrls.length} links loaded.
                      </div>
                    )}
                  </div>
                  <div>
                    <input type="text" placeholder="Internships Folder ID" value={internshipsFolderId} onChange={(e) => setInternshipsFolderId(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-text-primary-light dark:text-text-primary-dark" />
                    <button type="button" onClick={() => handleFetchImages(internshipsFolderId, 'internships')} disabled={isFetching} className="w-full mt-2 bg-primary-light dark:bg-primary-dark text-white dark:text-text-primary-dark py-2 rounded-lg font-semibold hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition disabled:opacity-50">
                      {isFetching ? 'Fetching...' : 'Fetch Internships Images'}
                    </button>
                    {assets.internshipsImageUrls.length > 0 && (
                      <div className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        {assets.internshipsImageUrls.length} links loaded.
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary-light dark:bg-primary-dark text-text-primary-dark dark:text-text-primary-light py-2 rounded-lg font-semibold hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Links to Firestore'}
                  </button>
                </form>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-background-light dark:bg-background-dark p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Manage Projects</h2>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((p) => (
                  <div key={p.id} className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 py-3">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">{p.title}</h3>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">{p.description}</p>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-secondary-light dark:text-secondary-dark hover:underline text-sm">View Project</a>}
                      {p.mediaUrl && <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary-light dark:text-primary-dark hover:underline text-sm ml-2">View Media</a>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags?.map(tag => (
                          <span key={tag} className="bg-background-alt-light dark:bg-background-alt-dark text-text-primary-light dark:text-text-primary-dark text-xs font-medium px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProject(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition flex-shrink-0">
                      Delete
                    </button>
                  </div>
                )) : <p className="text-text-secondary-light dark:text-text-secondary-dark">No projects found. Add one to get started!</p>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}