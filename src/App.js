// App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import VocalAnalysis from './components/Voice/VocalAnalysis';
import ChatHistory from './components/ChatHistory/ChatHistory';

const App = () => {
  const isAuthenticated = () => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    return email && password;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Use a nested route for authenticated users */}
      <Route path="/" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
        {/* Place the "/voice" route inside Layout for authenticated users */}
        <Route path="/voice" element={<VocalAnalysis />} />
        <Route path="/ChatHistory" element={<ChatHistory/>}/>
      </Route>
    </Routes>
  );
};

export default App;
