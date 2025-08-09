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
  // It receives the error and returns a new state object to trigger a re-render
  // with the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This lifecycle method is also called when an error is thrown. It's the ideal
  // place for side effects, such as logging the error to an external service
  // like Sentry, LogRocket, or a custom logging endpoint.
  componentDidCatch(error, errorInfo) {
    // For now, we'll just log it to the console.
    // In a production environment, you would send this data to a monitoring service.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error has been caught, render the fallback UI.
    if (this.state.hasError) {
      return (
        <div className="bg-slate-100 text-slate-800 min-h-screen flex flex-col justify-center items-center p-6 text-center font-sans">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              {/* An icon to visually represent the error state. */}
              <svg className="w-24 h-24 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-slate-700">Oops, something went wrong!</h1>
            <p className="text-lg text-slate-600 mb-6">
              An unexpected error has occurred. Please refresh the page or try again later.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Refresh Page
              </button>
              <a 
                href="/"
                className="bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
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
