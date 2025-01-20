import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { database } from '../firebase.config';
import { ref, get, child } from "firebase/database";

function LogAdmin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Reference the "mainAdmin" node in your Firebase database
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "mainAdmin"));

      if (snapshot.exists()) {
        const adminData = snapshot.val();

        // Check if the entered credentials match the admin credentials
        if (
          adminData.username === username &&
          adminData.password === password
        ) {
          navigate('/dashboard'); // Navigate to the home page on successful login
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        setError('No admin data found in the database.');
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="log-cont">
      <h2 className="logo">SmartQueues-Main Admin</h2>
      <div className="log-card">
        <div className="log-creds">
          <h2 className="credz">Username:</h2>
          <input
            className="inpz"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <h2 className="credz">Password:</h2>
          <input
            className="inpz"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="log-submit" onClick={handleLogin}>
            Submit
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default LogAdmin;
