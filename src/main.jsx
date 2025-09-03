// =================================================================================
// FILE: src/main.jsx (FINAL REFACTOR)
// =================================================================================
// This is the main entry point for the React application.
// It renders the root App component to the DOM.
// The App component handles its own error boundaries and theme providers,
// making this file as minimal as possible.
// =================================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component.
import App from './App.jsx';

// Import the global stylesheet.
import './index.css'; 

// The root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a React root and render the application.
// The ErrorBoundary is already handled inside App.jsx, so it's not needed here.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);