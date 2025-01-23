import React, { useState } from 'react';
import { auth, database } from '../firebase.config.js';
import { ref, set, get, child } from 'firebase/database';
import Sidebar from '../components/sidebar.jsx';



function AddAccount() {
  const [username, setUserName] = useState('');
  const [name, setName] = useState('');
  const [Apassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [response, setResponse] = useState('');


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Apassword !== confirmPassword) {
      setResponse("Passwords do not match.");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*[A-Z]).{8,}$/.test(Apassword)) {
      setResponse(
        "Password must be at least 8 characters long, with at least one letter and one uppercase letter."
      );
      return;
    }

    try {
      // Check if the username already exists in the database
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `admin/${username}`));
      if (snapshot.exists()) {
        setResponse("Username already exists.");
        return;
      }



      // Get current date and time in PHT (Philippine Time)
      const now = new Date();
      const timeZoneOffset = 8 * 60; // Philippines is UTC+8
      now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + timeZoneOffset);
      const registrationDate = now.toISOString().slice(0, 19).replace('T', ' ');

      // Save user data to Firebase Realtime Database
      await set(ref(database, `admin/${username}`), {
        Name: name,
        Username: username,
        Password: Apassword, // Store password (hashed for security in a real app)
        Date_and_Time_Registered: registrationDate,
      });

      alert("Registration Successful");
      setUserName('');
      setName('');
      setPassword('');
      setConfirmPassword('');

      
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
   <>
   <Sidebar/>
    <div className="d-container">
    <div className="d-head">
         <h4>Admin Registration</h4>
         <hr/>
      </div>
      <div className="reg-cont">
         <div className="addAcc-card">
        <div className="credWrap">
          <p className="creds">Username</p>
          <input type="text" className="addAcc-input" id="username" name="username" value={username} onChange={(e) => setUserName(e.target.value)} required/>
        </div>
          
        <div className="credWrap">
          <p className="creds">Name</p>
          <input type="text" className="addAcc-input" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="credWrap">
          <p className="creds">Password</p>
          <input type="password" className="addAcc-input" id="password" name="password" value={Apassword} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="credWrap">
          <p className="creds">Confirm Password</p>
          <input type="password" className="addAcc-input" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          </div>

          <form onSubmit={handleSubmit}>
  <button type="submit" className="addAcc-btn" id="signupBtn">
    Sign Up
  </button>
</form>

      
        {response && <div id="response">{response}</div>}

      </div>
      </div>
  
    </>
  );
}



export default AddAccount;
