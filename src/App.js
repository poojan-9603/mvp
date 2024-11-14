// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Import your LoginPage component
import CreateAccount from './pages/CreateAccount'; // Import your CreateAccount component
import FirstTimeLogin from './pages/FirstTimeLogIn'; // Import your FirstTimeLogin component
import Dashboard from './pages/Dashboard'; // Import your Dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Home route */}
        <Route path="/create-account" element={<CreateAccount />} /> {/* Route for create account */}
        <Route path="/first-time-login" element={<FirstTimeLogin />} /> {/* Route for first time login */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Route for dashboard */}
      </Routes>
    </Router>
  );
};

export default App;