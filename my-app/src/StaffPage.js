import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Lowercase import


function StaffPage({ goBack }) {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    try {
      // Attempt to log in with staff ID as the email
      const email = `${staffId}@mohammadiyah.com`; // Construct staff email from ID
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
      // Redirect or handle post-login logic here (e.g., navigate to staff dashboard)
    } catch (err) {
      setError("Invalid Login"); // Display error message
    }
  };

  return (
    <div className="portal">
      <h1>Staff Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display login errors */}
      <button onClick={goBack}>Back to Home</button>
      
      <div className="toggle-signup">
        {isSignUp ? (
          <p>Already have an account? <span onClick={() => setIsSignUp(false)} style={{ color: 'blue', cursor: 'pointer' }}>Log in here</span></p>
        ) : (
          <p>Don't have an account? <span onClick={() => setIsSignUp(true)} style={{ color: 'blue', cursor: 'pointer' }}>Sign up here</span></p>
        )}
      </div>
    </div>
  );
}

export default StaffPage;
