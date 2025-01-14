import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Import Firebase auth instance

function UserPage({ goBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission reload
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful');
      // Add logic here to redirect or perform actions after login
    } catch (err) {
      setError("Invalid Login"); // Display any errors
    }
  };

  return (
    <div className="portal">
      <h1>User Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default UserPage;