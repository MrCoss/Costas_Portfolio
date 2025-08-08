// =================================================================================
// FILE: src/ErrorBoundary.jsx
// =================================================================================
// This is a React class component that acts as an Error Boundary. It catches
// JavaScript errors anywhere in its child component tree, logs those errors,
// and displays a fallback UI instead of the component tree that crashed.
// This is an industry-standard practice for creating robust and resilient applications.
// =================================================================================

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method is triggered when a descendant component throws an error.
  // It receives the error that was thrown and should return a value to update state.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This lifecycle method is also called when a descendant component throws an error.
  // It's a good place to log the error to an external service like Sentry, LogRocket, etc.
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error has been caught, render the fallback UI.
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: '#334155'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p>Please refresh the page. The error has been logged to the developer console.</p>
        </div>
      );
    }

    // If there's no error, render the children components as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;