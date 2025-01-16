import React, { useState, useEffect } from 'react';
import './SubmitTaskLog.css'; // Import CSS for styling
import { db, auth } from './firebase'; // Import Firebase configuration
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore'; // Firestore methods
import { useNavigate } from 'react-router-dom';

function SubmitTaskLog() {
  const [description, setDescription] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [admins, setAdmins] = useState([]); // Dynamically loaded admins
  const navigate = useNavigate();

  // Fetch staff data from Firestore
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const staffCollection = collection(db, 'staff');
        const staffSnapshot = await getDocs(staffCollection);
        const staffList = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdmins(staffList.map((staff) => staff.name)); // Assuming 'name' field exists
      } catch (error) {
        console.error('Error fetching admins:', error);
        alert('Failed to fetch staff data. Please try again.');
      }
    };

    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || selectedAdmins.length === 0) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert('You must be logged in to submit a task.');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert('User not found in Firestore.');
        return;
      }

      const userName = userDoc.data().name;

      const newTaskLog = {
        description,
        adminSupervised: selectedAdmins,
        timestamp: new Date().toISOString(),
        user: userName,
        userID: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'taskLogs'), newTaskLog);
      console.log('Task log added with ID:', docRef.id);

      await updateDoc(userRef, {
        lastSubmittedTask: newTaskLog.timestamp,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        setSelectedAdmins([]);
      }, 1000);
    } catch (error) {
      console.error('Error adding task log:', error);
      alert('Failed to submit task log. Please try again.');
    }
  };

  const handleAdminSelection = (e) => {
    const value = e.target.value;
    setSelectedAdmins((prev) =>
      prev.includes(value) ? prev.filter((admin) => admin !== value) : [...prev, value]
    );
  };

  return (
    <div className="submit-task-log fullscreen">
      <button
        onClick={() => navigate('/user-dash')}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: 100,
          backgroundColor: 'black',
        }}
      >
        Back
      </button>
      <h1>Submit Task Log</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Task Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task you completed"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="admins">Admin Supervised By:</label>
          <div id="admins" className="checkbox-group">
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={admin}
                    checked={selectedAdmins.includes(admin)}
                    onChange={handleAdminSelection}
                  />
                  {admin}
                </label>
              ))
            ) : (
              <p>Loading admin options...</p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={submitted}>
          {submitted ? 'Submitted!' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default SubmitTaskLog;
