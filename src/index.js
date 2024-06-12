import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Replace ReactDOM.render with createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap your App component with BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
