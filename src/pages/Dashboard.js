// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; // Import Firestore database and Auth
import { query, collection, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation for navigation
import './Dashboard.css'; // Import CSS for styling

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [isVisible, setIsVisible] = useState(false); // State for animation visibility
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get the location object
  const referenceId = location.state?.referenceId; // Access the reference ID from state

  // Get current date
  const currentDate = new Date().toLocaleDateString(); // Format the current date

  const fetchUserData = async (userId) => {
    try {
      const userQuery = query(collection(db, 'users'), where('uid', '==', userId)); // Query to find the user document based on uid
      const userSnapshot = await getDocs(userQuery); // Get the document snapshot

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0]; // Get the first document
        setUserData(userDoc.data()); // Set user data
        setIsVisible(true); // Set visibility to true for animation
      } else {
        alert('User document does not exist. Please complete your profile.');
        navigate('/first-time-login'); // Redirect to first-time login if document does not exist
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
      alert('There was an error fetching user data. Please try again.');
    }
  };

  useEffect(() => {
    const user = auth.currentUser; // Get the currently authenticated user
    if (user) {
      fetchUserData(user.uid); // Fetch user data based on user ID
    } else {
      navigate('/login'); // Redirect to login if user is not authenticated
    }
  }, [navigate]);

  const totalExpenses = userData ? 
    (userData.bikeCost?.bikeInitialCost || 0) + 
    (userData.bikeCost?.bikeExpensePerMonth || 0) + 
    (userData.bikeCost?.bikeAdditionalExpense || 0) : 0;

  const savings = userData ? userData.savings || 0 : 0; // Get savings from user data or default to 0
  const balance = savings - totalExpenses; // Calculate balance

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚴 Your Bike Cost Dashboard</h1>
      <div className="header">
        <span className="current-date">{currentDate}</span> {/* Display current date */}
        <button className="streaks-button" onClick={() => navigate('/streaks', { state: { referenceId } })}>Streaks</button> {/* Streaks button */}
      </div>
      <div className="animation-container">
        <div className="animated-scene">
          <div className="running-man"></div>
          <div className="bus"></div>
          <div className="cycle"></div>
        </div>
      </div>
      <div className="navbar">
        <div className="nav-item">
          <h2 className="nav-title">Total Expenses</h2>
          <p className={`value ${isVisible ? 'fade-in' : ''}`}>${totalExpenses}</p>
        </div>
        <div className="nav-item">
          <h2 className="nav-title">Savings</h2>
          <p className={`value ${isVisible ? 'fade-in' : ''}`}>${savings}</p>
        </div>
      </div>
      <h2 className={`balance-title ${isVisible ? 'fade-in' : ''}`}>Balance: ${balance}</h2>
      <div className="card">
        <h2 className="card-title">Balance</h2>
        <p className={`value ${isVisible ? 'fade-in' : ''}`}>${balance}</p>
        <button className="button" onClick={() => navigate('/go-out')}>Go Out</button>
        <button className="login-button" onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
  );
};

export default Dashboard;