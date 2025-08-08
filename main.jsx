// =================================================================================
// FILE: src/main.jsx
// =================================================================================
// This is the main entry point for the React application.
// It renders the root App component to the DOM.
// It also wraps the entire application in an ErrorBoundary to catch runtime
// errors and prevent the application from crashing completely.
// =================================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './index.css'; // Imports global styles, including Tailwind CSS

// The root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a React root and render the application.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
// This setup ensures that any errors in the component tree will be caught by the ErrorBoundary,