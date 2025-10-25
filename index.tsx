import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the main entry point for the React application.

// 1. Find the root HTML element in `index.html` where the app will be attached.
//    This element has an id of 'root'.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// 2. Create a React root for the `rootElement`.
//    This is the modern way to render a React app (React 18+).
const root = ReactDOM.createRoot(rootElement);

// 3. Render the main `App` component into the React root.
//    <React.StrictMode> is a wrapper that helps find potential problems in the app.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);