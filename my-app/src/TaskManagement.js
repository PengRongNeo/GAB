import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import your Firebase config
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import './App.css'; // Import separate CSS file for styling
import { useNavigate } from 'react-router-dom';

function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);  // Track selected task
  const [pointsToAward, setPointsToAward] = useState('');  // Points to award for the selected task
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Reference to the taskLogs collection
    const taskLogsRef = collection(db, 'taskLogs');

    // Query to order tasks by timestamp
    const taskQuery = query(taskLogsRef, orderBy('timestamp', 'asc'));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      taskQuery,
      (snapshot) => {
        const tasksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        setLoading(false);
      }
    );

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestampString) => {
    if (!timestampString) return 'N/A'; // Fallback for missing timestamps
    const date = new Date(timestampString); // Parse the ISO string to a Date object
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid date strings
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTaskId(taskId);
    setPointsToAward('');
    setSuccessMessage('');
  };

  const handleAwardPoints = async () => {
    if (!selectedTaskId || !pointsToAward) {
      alert('Please select a task and enter points to award.');
      return;
    }
  
    // Find the task data for the selected task
    const selectedTask = tasks.find(task => task.id === selectedTaskId);
    if (!selectedTask) {
      alert('Task not found.');
      return;
    }
  
    // Get the user UID from the task (assumed to be stored in the task document)
    const userUID = selectedTask.userID;  // Assuming userID is stored in the task document
  
    if (!userUID) {
      alert('User not found for this task.');
      return;
    }
  
    // Reference to the user document in the 'users' collection
    const userRef = doc(db, 'users', userUID);
  
    try {
      // Fetch the current user data to get the current wallet value
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        alert('User document not found.');
        return;
      }
  
      const userData = userDoc.data();
      const currentWallet = userData.wallet || 0; // Fallback to 0 if no wallet field
  
      // Calculate new wallet balance
      const newWalletBalance = currentWallet + parseInt(pointsToAward, 10);
  
      // Update the user's wallet with the awarded points
      await updateDoc(userRef, {
        wallet: newWalletBalance,  // Update wallet balance
      });
  
      // Reference to the task document in 'taskLogs' collection
      const taskRef = doc(db, 'taskLogs', selectedTaskId);
  
      // Delete the task after awarding points
      await deleteDoc(taskRef);
  
      setSuccessMessage(`Successfully awarded ${pointsToAward} points`);
      setPointsToAward('');
      setSelectedTaskId(null);
    } catch (error) {
      console.error('Error updating user wallet or deleting task:', error);
      alert('Failed to award points and delete task. Please try again.');
    }
  };
  

  return (
    <div 
  className="task-management-container" 
  style={{
    width: '90%',  /* Increase width to 90% for a larger horizontal spread */
    margin: '0 auto',
    padding: '40px', /* Keep generous padding */
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '30px'
  }}
>


      <button 
        onClick={() => navigate('/staff-dash')} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' ,
          width:100,
          backgroundColor: 'black'
        }}
      >Back</button>
      <div style={{backgroundColor:'rgb(100, 100, 100)', padding: 20, borderRadius:15}}>
      <h1 className="page-title" style={{color:'white'}}>Task Management</h1>
      </div>
      {loading && <p className="loading">Loading tasks...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && tasks.length === 0 && <p>No tasks pending.</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="task-management-content">
        <div className="task-list" >
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.id === selectedTaskId ? 'selected' : ''}`}
              onClick={() => handleTaskSelection(task.id)}
            >
              <p className="task-user"><strong>User:</strong> {task.user || 'Unknown'}</p>
              <p className="task-admin"><strong>Admin Supervised:</strong> {task.adminSupervised || 'N/A'}</p>
              <p className="task-description"><strong>Description:</strong> {task.description || 'No description'}</p>
              <p className="task-timestamp"><strong>Timestamp:</strong> {formatTimestamp(task.timestamp)}</p>
            </div>
          ))}
        </div>

        <div className="award-points-container" style={{width: 300}} >
          {selectedTaskId && (
            <div className="award-points-form">
              <h2>Approve Task</h2>
              <input
                type="number"
                value={pointsToAward}
                onChange={(e) => setPointsToAward(e.target.value)}
                placeholder="Enter points to award"
                min="1"
                style={{width: 200, marginRight: 20}}
              />
              <button onClick={handleAwardPoints} >Award Points</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManagementPage;
