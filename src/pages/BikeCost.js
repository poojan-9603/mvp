// src/pages/BikeCost.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './BikeCost.css'; // Import the CSS file for styling

const BikeCost = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [userData, setUserData] = useState(null);
  const userId = 'USER_ID_HERE'; // Replace with the actual user ID

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="bike-cost-container">
      <h1 className="bike-cost-title">Bike Cost Estimation</h1>
      {userData ? (
        <div className="bike-cost-details">
          <h2 className="bike-cost-subtitle">User Information</h2>
          <p><strong>Nickname:</strong> {userData.nickname}</p>
          <p><strong>Biking Experience:</strong> {userData.bikingExperience}</p>
          <p><strong>Biking Frequency:</strong> {userData.bikingFrequency} times per week</p>
          <p><strong>Hardcore Level:</strong> {userData.hardcoreLevel}</p>
          {/* Add more details or calculations related to bike costs here */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={() => navigate('/')} className="back-button">Back to Home</button>
    </div>
  );
};

export default BikeCost;