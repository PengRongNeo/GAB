import React, { useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase'; 
import { doc, setDoc } from 'firebase/firestore';

function UserPage({ goBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

        // Store user info in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
        });

        alert('Sign up successful!');
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Log In Logic
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      } catch (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="portal">
<<<<<<< HEAD
      <h1>{isSignUp ? 'Sign Up' : 'User Login'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAuth}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {isSignUp && (
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        )}

        <button type="submit" disabled={loading}>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>

=======
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
>>>>>>> 28754a433e79c73721069d1a693501bf9d8a5a1d
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

<<<<<<< HEAD
export default UserPage;

=======
export default UserPage;
>>>>>>> 28754a433e79c73721069d1a693501bf9d8a5a1d
