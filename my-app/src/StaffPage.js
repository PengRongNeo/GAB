import React, { useState } from 'react';
import { auth, db } from './firebase'; // Ensure you've set up firebase.js as described earlier
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function StaffPage({ goBack }) {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setError('');
    setSuccessMessage('');

    try {
      // Authenticate the staff
      const userCredential = await signInWithEmailAndPassword(auth, staffId, password);
      const user = userCredential.user;

      // Verify if the user is a staff in Firestore
      const staffDoc = await getDoc(doc(db, 'staff', user.uid));
      if (staffDoc.exists()) {
        setSuccessMessage('Login successful! Welcome, Staff.');
        console.log('Staff details:', staffDoc.data());
        // Redirect to staff dashboard or perform further actions
      } else {
        throw new Error('Unauthorized access. Staff details not found.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="portal">
      <h1>Staff Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Staff ID (Email)"
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
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <button onClick={goBack}>Back to Home</button>
    </div>
  );
}

export default StaffPage;
