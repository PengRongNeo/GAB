import React, { useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function StaffPage({ goBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [staffID, setStaffID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Add a name state
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
      if (staffID != 'MWHSTAFF123') {
        setError('Invalid Staff ID!');
        setLoading(false);
        return;
      }
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store staff info in Firestore with name, staffID, email, and password
        await setDoc(doc(db, 'staff', user.uid), {
          name: name, // Store the staff's name
          staffID: staffID,
          email: user.email,
          createdAt: new Date(),
        });

        navigate('/staff-dash');
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Log In Logic
      try {
        await signInWithEmailAndPassword(auth, email, password);

        navigate('/staff-dash');
      } catch (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="portal">
      <h1>{isSignUp ? 'Staff Sign Up' : 'Staff Login'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAuth}>
        {isSignUp ? (
          <>
            <input 
              type="text" 
              placeholder="Name" // Name input field
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Staff ID" 
              value={staffID} 
              onChange={(e) => setStaffID(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </>
        ) : (
          <input 
            type="email" 
            placeholder="Email (used for login)" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        )}

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

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <p>Already have an account? 
            <span onClick={() => setIsSignUp(false)} style={{ color: 'blue', cursor: 'pointer' }}>
              Log in here
            </span>
          </p>
        ) : (
          <p>Don't have an account? 
            <span onClick={() => setIsSignUp(true)} style={{ color: 'blue', cursor: 'pointer' }}>
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default StaffPage;
