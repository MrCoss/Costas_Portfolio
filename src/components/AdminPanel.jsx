// =================================================================================
// FILE: src/components/AdminPanel.jsx
// =================================================================================
// A comprehensive admin panel for managing portfolio content. This component has
// been refactored for a professional UI/UX, robust error handling, and enhanced
// maintainability. It includes authentication, CRUD operations for projects, and
// file uploads to Firebase, all wrapped in a clean, modern interface.
// =================================================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import LoadingSpinner from "./ui/LoadingSpinner.jsx";

// A reusable, non-blocking notification component
const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;
  const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300";
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-bold">X</button>
    </div>
  );
};

export default function AdminPanel({ db, auth, storage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // --- State for Forms ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", link: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- Notification Handler ---
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  // --- Auth Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // --- Data Fetching ---
  const fetchProjects = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      showNotification("Failed to fetch projects.");
    }
  }, [db]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  // --- Event Handlers ---
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

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      return showNotification("Project title is required.");
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "projects"), {
        ...newProject,
        createdAt: serverTimestamp(),
      });
      setNewProject({ title: "", description: "", link: "" });
      showNotification("Project added successfully!", "success");
      fetchProjects();
    } catch (err) {
      console.error("Error adding project:", err);
      showNotification("Failed to add project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
        try {
            await deleteDoc(doc(db, "projects", id));
            setProjects((prev) => prev.filter((p) => p.id !== id));
            showNotification("Project deleted successfully.", "success");
        } catch (err) {
            console.error("Error deleting project:", err);
            showNotification("Failed to delete project.");
        }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `project-assets/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      navigator.clipboard.writeText(url);
      showNotification(`File uploaded! URL copied to clipboard.`, "success");
    } catch (err) {
      console.error("Upload error:", err);
      showNotification("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // --- Render Login Form ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold text-slate-700 text-center mb-6">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard ---
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">
      <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Add Project & Upload */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-700 mb-4">Add New Project</h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                <input type="url" placeholder="Project Link (e.g., GitHub)" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-slate-400">
                  {isSubmitting ? 'Adding...' : 'Add Project'}
                </button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-700 mb-4">Upload Asset</h2>
              <input type="file" onChange={handleFileUpload} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              {uploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
            </div>
          </div>

          {/* Right Column: Projects List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Manage Projects</h2>
            <div className="space-y-4">
              {projects.length > 0 ? projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-slate-200 py-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{p.title}</h3>
                    <p className="text-slate-600 text-sm">{p.description}</p>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View Link</a>}
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              )) : <p className="text-slate-500">No projects found. Add one to get started!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
