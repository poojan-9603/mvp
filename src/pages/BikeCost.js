import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, increment, getDocs, query, collection, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BikeCost = () => {
  const [bikePrice, setBikePrice] = useState(1);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [anonymousExpense, setAnonymousExpense] = useState('');
  const [userId, setUserId] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserDocument(user.uid);
    } else {
      alert('User not authenticated. Please log in.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserDocument = async (userId) => {
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        setDocumentId(userDoc.id);
      } else {
        console.log('User document does not exist');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
      alert('There was an error fetching user data. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentId) {
      alert('Document ID is not set. Cannot update document.');
      return;
    }

    const bikeCostData = {
      bikeInitialCost: parseFloat(bikePrice),
      bikeExpensePerMonth: parseFloat(monthlyExpenses),
      bikeAdditionalExpense: parseFloat(anonymousExpense || 0),
    };

    const totalExpenses = bikeCostData.bikeInitialCost + bikeCostData.bikeExpensePerMonth + bikeCostData.bikeAdditionalExpense;

    const userDocRef = doc(db, 'users', documentId);

    try {
      await updateDoc(userDocRef, {
        bikeCost: bikeCostData,
        expenses: increment(totalExpenses),
      });
      alert('Bike cost data saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('There was an error saving your bike cost data. Please try again.');
    }
  };

  const getPriceEmoji = () => {
    if (bikePrice < 3000) {
      return '🚲';
    } else if (bikePrice < 7000) {
      return '🚴‍♂️';
    } else {
      return '🚵‍♀️';
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚴 Bike Cost Estimator</h1>
      <p style={styles.description}>Let's calculate the total cost of owning your bike!</p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="bikePrice" style={styles.label}>
            💲 Price of the Bike (in USD): {getPriceEmoji()}
          </label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              id="bikePrice"
              min="1"
              max="10000"
              value={bikePrice}
              onChange={(e) => setBikePrice(e.target.value)}
              style={styles.slider}
            />
            <div style={styles.priceDisplay}>${bikePrice}</div>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="monthlyExpenses" style={styles.label}>🛠️ Monthly Maintenance Expenses (in USD):</label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              id="monthlyExpenses"
              min="0"
              max="1000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              style={styles.slider}
            />
            <div style={styles.priceDisplay}>${monthlyExpenses}</div>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="anonymousExpense" style={styles.label}>🤫 Optional Anonymous Expense (in USD):</label>
          <div style={styles.inputContainer}>
            <span style={styles.inputIcon}>$</span>
            <input
              type="number"
              id="anonymousExpense"
              value={anonymousExpense}
              onChange={(e) => setAnonymousExpense(e.target.value)}
              style={styles.fancyInput}
              placeholder="Optional"
            />
          </div>
        </div>
        <button type="submit" style={styles.submitButton}>💾 Save My Costs</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#00796b',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#004d40',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '1.1rem',
    marginBottom: '5px',
    color: '#00796b',
  },
  slider: {
    width: '100%',
    height: '20px',
    margin: '10px 0',
    cursor: 'pointer',
    appearance: 'none',
    background: '#00796b',
    borderRadius: '5px',
  },
  priceDisplay: {
    fontSize: '1.2rem',
    color: '#00796b',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: '5px',
  },
  fancyInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
};

export default BikeCost;