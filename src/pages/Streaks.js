// src/pages/Streaks.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; // Import Firestore and Auth
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import axios from 'axios'; // Import axios for API calls

const Streaks = ({ referenceId }) => {
  const [routeData, setRouteData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const user = auth.currentUser; // Get the currently authenticated user
        if (!user) {
          alert('User not authenticated.');
          return;
        }

        const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
        const userDoc = await getDoc(userDocRef); // Get the document snapshot

        if (userDoc.exists()) {
          const routes = userDoc.data().routes; // Get the routes array from the user document
          const foundRoute = routes.find(route => route.id === referenceId); // Find the route by reference ID

          if (foundRoute) {
            setRouteData(foundRoute); // Set the route data
            fetchWeather(foundRoute.location); // Fetch weather for the route's location
          } else {
            setError('Route not found.');
          }
        } else {
          setError('User document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching route data: ', error);
        setError('There was an error fetching route data. Please try again.');
      }
    };

    const fetchWeather = async (location) => {
      const apiKey = 'dbfcf41b20b47ce470bf14d15564c7d6'; // Your weather API key
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(weatherApiUrl);
        setWeatherData(response.data); // Set weather data
      } catch (error) {
        console.error('Error fetching weather: ', error);
        setError('Error fetching weather data.');
      }
    };

    fetchRouteData(); // Fetch route data on component mount
  }, [referenceId]); // Run effect when referenceId changes

  return (
    <div className="streaks-container">
      <h1 className="title">Your Streaks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {routeData ? (
        <div className="route-info">
          <h3>Route Details:</h3>
          <p>Source: {routeData.source}</p>
          <p>Destination: {routeData.destination}</p>
          <p>Distance: {routeData.distance} km</p>
          <p>Cost: ${routeData.cost}</p>
          {weatherData ? (
            <div>
              <h4>Weather Information:</h4>
              <p>Temperature: {weatherData.main.temp} °C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : (
        <p>Loading route data...</p>
      )}
    </div>
  );
};

export default Streaks;