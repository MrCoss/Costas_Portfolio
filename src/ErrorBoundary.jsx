// =================================================================================
// FILE: src/ErrorBoundary.jsx (FINAL REFACTOR)
// =================================================================================
// This file contains a reusable React Error Boundary and a styled fallback UI.
// It now uses a consistent and fully semantic color palette for a seamless dark
// mode experience.
// =================================================================================

import React from 'react';

// --- Fallback Component (Refactored for Semantic Dark Mode) ---
// This is the UI that gets displayed when an error is caught.
const ErrorFallback = ({ error }) => {
  const handleRefresh = () => window.location.reload();
  const handleGoHome = () => window.location.assign('/Costas_Portfolio/');

  return (
    // MODIFIED: Use semantic background colors.
    <div className="min-h-screen w-full flex items-center justify-center bg-background-alt-light dark:bg-background-alt-dark p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* MODIFIED: Use semantic background and text colors. */}
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        {/* MODIFIED: Use semantic text colors. */}
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          Oops, something went wrong!
        </h1>
        {/* MODIFIED: Use semantic text colors. */}
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
          An unexpected error has occurred. Please refresh the page or try again later.
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleRefresh}
            // MODIFIED: Use semantic button colors.
            className="px-6 py-2 rounded-full font-semibold text-white bg-primary-light hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={handleGoHome}
            // MODIFIED: Use semantic text and border colors.
            className="px-6 py-2 rounded-full font-semibold text-text-primary-light dark:text-text-primary-dark bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {/* Optional: Display error details for debugging in development */}
        {import.meta.env.DEV && (
          // MODIFIED: Use semantic background and text colors.
          <details className="mt-8 text-left bg-background-alt-light dark:bg-background-alt-dark p-4 rounded-md">
            <summary className="cursor-pointer font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Error Details (for developers)
            </summary>
            <pre className="mt-2 text-sm text-red-500 whitespace-pre-wrap">
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};


// --- Error Boundary Class Component (Unchanged) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;