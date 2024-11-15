// src/pages/LoginPage.js
import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Import Firestore and Auth instances
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Auth functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user exists in Firestore
      const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        
        // Update the user's firstTimeLogin status to false and loggedIn to true
        await updateDoc(doc(db, "users", userSnapshot.docs[0].id), {
          firstTimeLogin: false, // Set firstTimeLogin to false
          loggedIn: true // Set loggedIn to true
        });

        // Redirect based on firstTimeLogin status
        if (userData.firstTimeLogin) {
          // Redirect to FirstTimeLogin.js
          navigate('/first-time-login');
        } else {
          // Redirect to Dashboard.js
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error: ', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h1 style={styles.loginTitle}>Hello</h1> {/* Changed from "Login" to "Hello" */}
      <form style={styles.loginForm} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
      </form>
      <button 
        onClick={() => navigate('/create-account')} // Navigate to Create Account page
        style={styles.toggleButton}
      >
        Switch to Create Account
      </button>
    </div>
  );
};

// Inline styles remain unchanged
const styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#2c2c2c', // Dark grayish background
  },
  loginTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#ffffff', // White text for title
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    backgroundColor: '#3a3a3a', // Slightly lighter gray for form background
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #007bff', // Blue border
    backgroundColor: '#ffffff', // White background for input
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff', // Blue background
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  toggleButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#6c757d', // Gray background for toggle button
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
  },
};

// Export the LoginPage component
export default LoginPage;