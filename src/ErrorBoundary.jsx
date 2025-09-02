// =================================================================================
// FILE: src/ErrorBoundary.jsx
// =================================================================================
// This is a React class component that acts as an Error Boundary. It catches
// JavaScript errors anywhere in its child component tree, logs those errors,
// and displays a polished, user-friendly fallback UI instead of a crashed app.
// This is an industry-standard practice for creating robust and resilient applications.
// =================================================================================

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method is triggered when a descendant component throws an error.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This lifecycle method is also called when an error is thrown.
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error has been caught, render the fallback UI.
    if (this.state.hasError) {
      return (
        // UPDATED: Background and text colors now use the new theme.
        <div className="bg-background-alt text-text-primary min-h-screen flex flex-col justify-center items-center p-6 text-center font-sans">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              {/* An icon to visually represent the error state. */}
              {/* UPDATED: Icon color now uses the theme's secondary (pink) color. */}
              <svg className="w-24 h-24 mx-auto text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* UPDATED: Text colors now use the theme's primary and secondary text colors. */}
            <h1 className="text-4xl font-bold mb-4 text-text-primary">Oops, something went wrong!</h1>
            <p className="text-lg text-text-secondary mb-6">
              An unexpected error has occurred. Please refresh the page or try again later.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                // UPDATED: Primary button now uses the theme's primary (emerald) color.
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md"
              >
                Refresh Page
              </button>
              <a 
                href="/"
                // UPDATED: Secondary button now uses a clean, outlined style with theme colors.
                className="bg-transparent border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render the children components as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;