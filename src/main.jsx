// =================================================================================
// FILE: src/main.jsx
// =================================================================================
// This is the main entry point for the React application.
// It renders the root App component to the DOM and wraps it in an ErrorBoundary
// to catch runtime errors and prevent the application from crashing completely.
// =================================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Path: './App.jsx'
// This imports the main App component. The './' means it's looking for
// 'App.jsx' in the SAME directory as this file (src/).
import App from './App.jsx';

// Import Path: './ErrorBoundary.jsx'
// This imports the ErrorBoundary component from the SAME directory (src/).
import ErrorBoundary from './ErrorBoundary.jsx';

// Import Path: './index.css'
// This imports the global stylesheet from the SAME directory (src/).
import './index.css'; 

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
