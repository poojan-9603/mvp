// src/pages/CreateAccount.js
import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Import Firestore and Auth instances
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Auth functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        loggedIn: false, // Set loggedIn to false by default
        firstTimeLogin: true, // Set firstTimeLogin to true
      });

      alert('Account created successfully!');
      // Navigate back to Login Page
      navigate('/');
    } catch (error) {
      console.error('Error: ', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h1 style={styles.loginTitle}>Create Account</h1>
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
          Create My Account
        </button>
      </form>
    </div>
  );
};

// Inline styles (you can reuse the styles from LoginPage.js)
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
};

// Export the CreateAccount component
export default CreateAccount;