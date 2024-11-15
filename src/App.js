// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import FirstTimeLogin from './pages/FirstTimeLogin'; // Ensure the casing matches // Ensure the import matches the filename
import BikeCost from './pages/BikeCost'; // Import the BikeCost component

import Dashboard from './pages/Dashboard';

const App = () => { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/first-time-login" element={<FirstTimeLogin />} />
        <Route path="/bike-cost" element={<BikeCost />} /> {/* Bike cost route */}

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

// Export the App component
export default App;