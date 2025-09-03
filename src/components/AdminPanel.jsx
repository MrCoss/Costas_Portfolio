// =================================================================================
// FILE: src/components/AdminPanel.jsx (UPDATED)
// =================================================================================
// This version integrates Firebase Storage for direct image and video uploads.
// =================================================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  collection, addDoc, deleteDoc, doc, getDocs, setDoc, getDoc, serverTimestamp
} from "firebase/firestore";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";
// ADDED: Firebase Storage imports
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from "./ui/LoadingSpinner.jsx";

// --- SUB-COMPONENTS (Unchanged) ---
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50";
  const typeClasses = type === 'success' ? 'bg-primary' : 'bg-red-500';

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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6"
        >
          <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
          <p className="text-text-secondary mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition text-text-primary">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Confirm</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- MAIN ADMIN PANEL COMPONENT ---
// MODIFIED: Added `storage` prop for Firebase Storage
export default function AdminPanel({ db, auth, storage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState({ licensesPdfUrl: '', internshipsPdfUrl: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [modalState, setModalState] = useState({ isOpen: false, onConfirm: () => {} });

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // MODIFIED: Removed mediaUrl from newProject state
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "", tags: [] });
  // ADDED: State for file object and upload progress
  const [mediaFile, setMediaFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setAssets(docSnap.data());
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
  
  // ADDED: Handler for the new file input
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  // MODIFIED: Complete overhaul of handleAddProject to include file upload logic
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return showNotification("Project title is required.");
    
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let mediaUrl = ""; // Default media URL is an empty string

      // Step 1: Upload file to Storage if one is selected
      if (mediaFile) {
        const storageRef = ref(storage, `project_media/${Date.now()}_${mediaFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, mediaFile);

        // Use a promise to handle the async upload flow
        mediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error("Upload Error:", error);
              reject(error);
            },
            async () => {
              // On successful upload, get the download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      // Step 2: Add project data (with the new mediaUrl) to Firestore
      await addDoc(collection(db, "projects"), { 
        ...newProject, 
        mediaUrl, // This will be the URL from storage or ""
        createdAt: serverTimestamp() 
      });
      
      // Step 3: Reset form and state
      setNewProject({ title: "", description: "", link: "", tags: [] });
      setMediaFile(null);
      e.target.reset(); // This helps clear the file input
      showNotification("Project added successfully!", "success");
      fetchProjects();

    } catch (err) {
      showNotification("Failed to add project. Check console for details.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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

  // Login Form (Unchanged)
  if (!user) {
    return (
      <div className="min-h-screen bg-background-alt flex items-center justify-center p-4">
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-background shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition" required />
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:bg-slate-400">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Main Admin Dashboard
  return (
    <>
      <ConfirmModal 
        isOpen={modalState.isOpen} 
        onConfirm={modalState.onConfirm} 
        onCancel={() => setModalState({ isOpen: false, onConfirm: () => {} })} 
        title={modalState.title} 
        message={modalState.message} 
      />
      <div className="min-h-screen bg-background-alt p-4 sm:p-6 md:p-8">
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-text-primary">Admin Dashboard</h1>
            <button onClick={handleLogout} className="bg-secondary text-white px-5 py-2 rounded-lg font-semibold hover:bg-secondary-hover transition-colors">Logout</button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-background p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Add New Project</h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  <textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="3"></textarea>
                  <input type="url" placeholder="Project Link (e.g., GitHub)" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                  
                  {/* MODIFIED: Replaced URL input with file input */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Project Media (Image/Video)</label>
                    <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {mediaFile && <p className="text-xs text-text-secondary mt-1">Selected: {mediaFile.name}</p>}
                  </div>

                  <div>
                    <input type="text" placeholder="Add skills/tags and press Enter" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.tags.map(tag => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-primary/70 hover:text-primary">x</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* ADDED: Upload Progress Bar */}
                  {isSubmitting && uploadProgress > 0 && (
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-hover transition disabled:bg-slate-400">
                    {isSubmitting ? `Uploading... ${Math.round(uploadProgress)}%` : 'Add Project'}
                  </button>
                </form>
              </motion.div>
              
              {/* Asset Links Form (Unchanged) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-background p-6 rounded-xl shadow-lg">
                   <h2 className="text-2xl font-bold text-text-primary mb-4">Manage Asset Links</h2>
                   <form onSubmit={handleAssetUpdate} className="space-y-4">
                     <input type="url" placeholder="Licenses & Certs PDF URL" value={assets.licensesPdfUrl} onChange={(e) => setAssets({...assets, licensesPdfUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                     <input type="url" placeholder="Internship Certs PDF URL" value={assets.internshipsPdfUrl} onChange={(e) => setAssets({...assets, internshipsPdfUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                     <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-hover transition disabled:bg-slate-400">
                         {isSubmitting ? 'Saving...' : 'Save Links'}
                     </button>
                   </form>
              </motion.div>
            </div>

            {/* Manage Projects List (Unchanged) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-background p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Manage Projects</h2>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((p) => (
                  <div key={p.id} className="flex items-start justify-between border-b border-slate-200 py-3">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-lg text-text-primary">{p.title}</h3>
                      <p className="text-text-secondary text-sm mt-1">{p.description}</p>
                      {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline text-sm">View Project</a>}
                      {p.mediaUrl && <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm ml-2">View Media</a>}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags?.map(tag => (
                          <span key={tag} className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProject(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition flex-shrink-0">
                      Delete
                    </button>
                  </div>
                )) : <p className="text-text-secondary">No projects found. Add one to get started!</p>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}