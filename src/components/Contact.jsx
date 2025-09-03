// =================================================================================
// FILE: src/components/Contact.jsx (FINAL REFACTOR)
// =================================================================================
// This component now uses a consistent and fully semantic color palette
// for a seamless dark mode experience and a more user-friendly footer.
// =================================================================================

import React, { useState, useCallback } from 'react';
import {
  FaInstagram, FaDribbble, FaTwitter, FaFacebook, FaUser, FaEnvelope, FaCog, FaCheckCircle, FaExclamationTriangle,
} from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import AnimatedSection from './ui/AnimatedSection';
import AnimatedDivider from './ui/AnimatedDivider';
import { motion } from 'framer-motion';

const Contact = React.memo(() => {
  const [formState, setFormState] = useState({
    submitting: false, succeeded: false, error: null,
  });
  const [copyMessage, setCopyMessage] = useState(null);

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

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const socialLinks = [
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com/costaspinto' },
    { name: 'Dribbble', icon: <FaDribbble />, url: 'https://dribbble.com/costaspinto' },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com/costaspinto' },
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://facebook.com/costaspinto' },
  ];

  return (
    // MODIFIED: Use semantic background and text colors.
    <AnimatedSection id="contact" className="bg-background-alt-light dark:bg-background-alt-dark text-text-primary-light dark:text-text-primary-dark font-sans !py-0">
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        {/* MODIFIED: Use semantic text color. */}
        <h2 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark text-center">Let’s Get Connected!</h2>
        <AnimatedDivider />
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          {/* Left Panel: Information and Social Links */}
          <div className="flex-1 space-y-10">
            {/* MODIFIED: Use semantic text color. */}
            <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-md">
              Have a project in mind or just want to say hello? Fill out the form or follow me on my social media.
            </p>
            <div>
              {/* MODIFIED: Use semantic text color. */}
              <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Follow Me</p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    // MODIFIED: Use semantic text and hover colors.
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors duration-300 text-2xl"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Contact Form */}
          {/* MODIFIED: Use semantic background colors. */}
          <div className="flex-1 bg-background-light/90 dark:bg-background-dark/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-primary-light/10 dark:border-primary-dark/20">
            <form
              action="https://formspree.io/f/mwpqwdnq"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="relative">
                {/* MODIFIED: Use semantic text and border colors. */}
                <label className="block font-medium mb-1 text-text-secondary-light dark:text-text-secondary-dark">Your Name *</label>
                <FaUser className="absolute left-3 top-10 text-text-secondary-light/50 dark:text-text-secondary-dark/50" />
                <input name="name" required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark" />
              </div>
              <div className="relative">
                <label className="block font-medium mb-1 text-text-secondary-light dark:text-text-secondary-dark">Your Email *</label>
                <FaEnvelope className="absolute left-3 top-10 text-text-secondary-light/50 dark:text-text-secondary-dark/50" />
                <input name="email" type="email" required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark" />
              </div>
              <div className="relative">
                <label className="block font-medium mb-1 text-text-secondary-light dark:text-text-secondary-dark">Service you are looking for *</label>
                <FaCog className="absolute left-3 top-10 text-text-secondary-light/50 dark:text-text-secondary-dark/50" />
                <input name="service" required className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-text-secondary-light dark:text-text-secondary-dark">Your Message</label>
                <textarea name="message" rows="4" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark" />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white dark:text-text-primary-dark font-semibold py-3 px-4 rounded-xl hover:brightness-110 transition-transform duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formState.submitting}
              >
                {formState.submitting ? 'Submitting...' : 'Submit'}
              </motion.button>
              {formState.succeeded && (
                // MODIFIED: Use semantic text color.
                <p className="flex items-center gap-2 text-primary-light dark:text-primary-dark text-sm mt-2">
                  <FaCheckCircle /> Thanks for your message! I'll get back to you soon.
                </p>
              )}
              {formState.error && (
                // MODIFIED: Use red for errors, as it's a standard and high-contrast choice.
                <p className="flex items-center gap-2 text-red-600 text-sm mt-2">
                  <FaExclamationTriangle /> Error: {formState.error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {/* MODIFIED: Use semantic background and text colors. */}
      <footer className="bg-background-dark dark:bg-background-alt-dark text-text-secondary-light dark:text-text-secondary-dark py-12 mt-20">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              {/* MODIFIED: Use semantic text colors. */}
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">I'm Available for Freelance Projects</h2>
              <p className="text-text-secondary-light/70 dark:text-text-secondary-dark/70">Feel free to initiate a project and let’s explore how we can collaborate.</p>
            </div>
            <div className="flex gap-4 relative">
              <button
                onClick={handleCopyEmail}
                // MODIFIED: Use semantic border, text, and hover colors.
                className="flex items-center gap-2 border border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark font-semibold py-2 px-4 rounded-xl hover:bg-secondary-light dark:hover:bg-secondary-dark hover:text-white dark:hover:text-text-primary-dark transition-colors"
              >
                <MdContentCopy /> COPY EMAIL
              </button>
              {copyMessage && (
                // MODIFIED: Use semantic text color.
                <span className="absolute -bottom-8 left-0 right-0 text-center text-sm text-primary-light dark:text-primary-dark">
                  {copyMessage}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-background-dark/50 dark:border-background-alt-light/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {/* MODIFIED: Use semantic text colors. */}
            <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">Costas Pinto</span>
            <nav className="flex gap-6">
              <motion.button
                onClick={handleScrollToTop}
                className="hover:text-secondary-light dark:hover:text-secondary-dark transition"
              >
                Home
              </motion.button>
            </nav>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-light dark:hover:text-secondary-dark transition text-lg">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-text-secondary-light/70 pt-4">
            &copy; {new Date().getFullYear()} Costas Pinto.
          </p>
        </div>
      </footer>
    </AnimatedSection>
  );
});

export default Contact;