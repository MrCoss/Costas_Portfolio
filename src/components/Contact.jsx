// =================================================================================
// FILE: src/Contact.jsx
// =================================================================================
// This component renders the footer and contact form section.
// It uses Formspree for a serverless contact form and manages form state
// to provide feedback to the user (e.g., "Sending...", "Message Sent!").
// =================================================================================

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';
import AnimatedBackground from './ui/AnimatedBackground.jsx';
import LoadingSpinner from './ui/LoadingSpinner.jsx';
import AnimatedDivider from './ui/AnimatedDivider.jsx';

const Contact = React.memo(() => {
  // State to manage the form submission process
  const [formState, setFormState] = useState({
    submitting: false,
    succeeded: false,
    error: null,
  });

  // Handles the form submission using an async function
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setFormState({ submitting: true, succeeded: false, error: null });

    const form = event.target;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormState({ submitting: false, succeeded: true, error: null });
        form.reset();
      } else {
        // Handle server-side validation errors from Formspree
        const responseData = await response.json();
        const errorMessage = responseData.errors?.map(err => err.message).join(', ') || 'An unknown error occurred.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState({ submitting: false, succeeded: false, error: error.message });
    }
  }, []);

  return (
    <footer id="contact" className="bg-[#e2e8f0] border-t border-gray-300 mt-20">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-[#334155] mb-4">Let's Connect</h2>
        <p className="text-[#4b5563] max-w-2xl mx-auto mb-8">
          I'm always eager to connect. Whether you have a project in mind, a question, or just want to say hi, my inbox is always open.
        </p>
        
        {/*
          ACTION REQUIRED:
          1. Go to formspree.io and create a new form.
          2. Copy your unique form ID (e.g., 'mknlqjdy').
          3. Replace 'YOUR_UNIQUE_CODE' in the action URL below.
        */}
        <form
          action="https://formspree.io/f/YOUR_UNIQUE_CODE"
          method="POST"
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 text-left"
        >
          <input type="email" name="email" placeholder="Your Email" className="input-field" required disabled={formState.submitting} />
          <textarea name="message" placeholder="Your Message" className="input-field h-32" required disabled={formState.submitting}></textarea>
          
          <button type="submit" className="btn-primary w-full" disabled={formState.submitting}>
            {formState.submitting ? 'Sending...' : 'Send Message'}
          </button>

          {formState.succeeded && (
            <p className="text-center text-green-600 font-medium mt-4">
              Thanks for your message! I'll get back to you soon.
            </p>
          )}
          {formState.error && (
            <p className="text-center text-red-600 font-medium mt-4">
              Oops! There was a problem. {formState.error}
            </p>
          )}
        </form>

        <div className="border-t border-gray-300 mt-12 pt-8 text-[#64748b]">
          <div className="flex justify-center items-center gap-6 mb-4">
            <a href="https://www.linkedin.com/in/costaspinto/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#2563eb] transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
            </a>
            <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#334155] transition-colors">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/></svg>
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Costas Pinto. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
});

export default Contact;