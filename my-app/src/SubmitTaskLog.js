import React, { useState } from 'react';
import './SubmitTaskLog.css'; // Import CSS for styling
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

function SubmitTaskLog() {
  const [description, setDescription] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const admins = ["Ethan", "Joshua", "Santtosh", "PengRong"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || selectedAdmins.length === 0) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    // Create the TaskLog object
    const newTaskLog = {
      description: description,
      adminSupervised: selectedAdmins,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save TaskLog to Firebase
      const docRef = await addDoc(collection(db, 'taskLogs'), newTaskLog);
      console.log('Task log added with ID:', docRef.id);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        setSelectedAdmins([]);
      }, 3000); // Reset the form after 3 seconds
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
    <div className="submit-task-log">
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
            {admins.map((admin, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  value={admin}
                  checked={selectedAdmins.includes(admin)}
                  onChange={handleAdminSelection}
                />
                {admin}
              </label>
            ))}
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
