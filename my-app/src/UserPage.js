import React, { useState } from 'react';

function UserPage({ goBack }) {
  const [isSignUp, setIsSignUp] = useState(false);  // State to toggle between Login and Sign Up
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (either login or signup)
    alert(isSignUp ? 'Signing up...' : 'Logging in...');
  };

  return (
    <div className="portal">
      <h1>{isSignUp ? 'Sign Up' : 'User Login'}</h1>
      
      <form onSubmit={handleFormSubmit}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        
        {isSignUp && (
          <input type="password" placeholder="Confirm Password" required />
        )}
        
        <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      
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
