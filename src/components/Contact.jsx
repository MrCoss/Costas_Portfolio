// =================================================================================
// FILE: src/components/Contact.jsx (FIXED & COMPLETE)
// =================================================================================
// This version restores the missing handleSubmit and handleCopyEmail functions,
// making the contact form and footer fully interactive.
// =================================================================================

import React, { useState, useCallback } from 'react';
import {
  FaInstagram, FaDribbble, FaTwitter, FaFacebook, FaUser, FaEnvelope, FaCog, FaCheckCircle, FaExclamationTriangle,
} from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';

const Contact = React.memo(() => {
  // State to manage the contact form's status (submitting, success, error).
  const [formState, setFormState] = useState({
    submitting: false, succeeded: false, error: null,
  });

  // State for the "copied to clipboard" feedback message.
  const [copyMessage, setCopyMessage] = useState(null);

  // RESTORED: Handles the form submission logic using Formspree.
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setFormState({ submitting: true, succeeded: false, error: null });
    const form = event.target;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setFormState({ submitting: false, succeeded: true, error: null });
        form.reset();
        setTimeout(() => setFormState(s => ({ ...s, succeeded: false })), 5000);
      } else {
        const responseData = await response.json();
        const errorMessage = responseData.errors?.map((err) => err.message).join(', ') || 'An unknown error occurred.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      setFormState({ submitting: false, succeeded: false, error: error.message });
      setTimeout(() => setFormState(s => ({ ...s, error: null })), 5000);
    }
  }, []);

  // RESTORED: Copies the email address to the clipboard.
  const handleCopyEmail = useCallback(() => {
    const email = 'costaspinto312@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      setCopyMessage('Email copied to clipboard!');
      setTimeout(() => setCopyMessage(null), 3000);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
      setCopyMessage('Could not copy email.');
      setTimeout(() => setCopyMessage(null), 3000);
    });
  }, []);

  // Data array for social media links for easy rendering and maintenance.
  const socialLinks = [
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com/costaspinto' },
    { name: 'Dribbble', icon: <FaDribbble />, url: 'https://dribbble.com/costaspinto' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com/costaspinto' },
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://facebook.com/costaspinto' },
  ];

  return (
    <AnimatedSection id="contact" className="bg-background-alt text-text-primary font-sans !py-0">
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <h2 className="text-4xl font-bold text-text-primary text-center">Let’s Get Connected!</h2>
        <AnimatedDivider />
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          {/* Left Panel: Information and Social Links */}
          <div className="flex-1 space-y-10">
            <p className="text-lg text-text-secondary max-w-md">
              Have a project in mind or just want to say hello? Fill out the form or follow me on my social media.
            </p>
            <div>
              <p className="text-lg font-semibold text-text-primary mb-4">Follow Me</p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-text-secondary hover:text-secondary transition-colors duration-300 text-2xl"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Contact Form */}
          <div className="flex-1 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/30">
            <form
              action="https://formspree.io/f/mwpqwdnq"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="relative">
                <label className="block font-medium mb-1 text-text-secondary">Your Name *</label>
                <FaUser className="absolute left-3 top-10 text-text-secondary/50" />
                <input name="name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <label className="block font-medium mb-1 text-text-secondary">Your Email *</label>
                <FaEnvelope className="absolute left-3 top-10 text-text-secondary/50" />
                <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="relative">
                <label className="block font-medium mb-1 text-text-secondary">Service you are looking for *</label>
                <FaCog className="absolute left-3 top-10 text-text-secondary/50" />
                <input name="service" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-text-secondary">Your Message</label>
                <textarea name="message" rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-4 rounded-xl hover:brightness-110 transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formState.submitting}
              >
                {formState.submitting ? 'Submitting...' : 'Submit'}
              </button>
              {formState.succeeded && (
                <p className="flex items-center gap-2 text-primary text-sm mt-2">
                  <FaCheckCircle /> Thanks for your message! I'll get back to you soon.
                </p>
              )}
              {formState.error && (
                <p className="flex items-center gap-2 text-red-600 text-sm mt-2">
                  <FaExclamationTriangle /> Error: {formState.error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-text-primary text-slate-300 py-12 mt-20">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">I'm Available for Freelance Projects</h2>
              <p className="text-slate-400">Feel free to initiate a project and let’s explore how we can collaborate.</p>
            </div>
            <div className="flex gap-4 relative">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 border border-secondary text-secondary font-semibold py-2 px-4 rounded-xl hover:bg-secondary hover:text-white transition-colors"
              >
                <MdContentCopy /> COPY EMAIL
              </button>
              {copyMessage && (
                <span className="absolute -bottom-8 left-0 right-0 text-center text-sm text-primary">
                  {copyMessage}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <span className="font-semibold text-white">Costas Pinto</span>
            <nav className="flex gap-6">
              <a href="#home" className="hover:text-secondary transition">Home</a>
              <a href="#about" className="hover:text-secondary transition">About</a>
            </nav>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                       <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition text-lg">
                         {social.icon}
                       </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 pt-4">
            &copy; {new Date().getFullYear()} Costas Pinto.
          </p>
        </div>
      </footer>
    </AnimatedSection>
  );
});

export default Contact;