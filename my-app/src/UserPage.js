import React, { useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css'; 

function UserPage({ goBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');  // Add a name input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      // Sign Up Logic
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in Firestore with additional attributes
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: name,  // Store the user's name
          wallet: 0,  // Initialize wallet balance as 0
          cart: [],  // Initialize cart as an empty list
          preorder: [],  // Initialize preorder as an empty list
        });

    
        navigate('/user-dash'); // Redirect to UserDash page after signup
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Log In Logic
      try {
        await signInWithEmailAndPassword(auth, email, password);

        navigate('/user-dash'); // Redirect to UserDash page after login
      } catch (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="portal">
      <h1>{isSignUp ? 'Sign Up' : 'User Login'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAuth}>
        {isSignUp && (
          <input 
      type="text" 
      placeholder="Full Name" 
      value={name} 
       onChange={(e) => setName(e.target.value)} 
      required 
    />
  )}
  
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
  
  {isSignUp && (
    <input 
      type="password" 
      placeholder="Confirm Password" 
      value={confirmPassword} 
      onChange={(e) => setConfirmPassword(e.target.value)} 
      required 
    />
  )}

  <div className="form-buttons">
    <button type="submit" disabled={loading}>
      {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
    </button>
    <button type="button" onClick={goBack}>
      Back to Home
    </button>
  </div>
</form>

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
