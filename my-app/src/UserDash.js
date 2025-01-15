import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './UserDash.css'; // Import custom CSS for styling
import { db, auth } from './firebase';  // Assuming firebase is initialized elsewhere
import { doc, getDoc } from 'firebase/firestore';  // Firestore methods

function UserDash() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', wallet: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data (name and wallet balance) from Firestore using the current user’s UID
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setUserData({
            name: userSnapshot.data().name,
            wallet: userSnapshot.data().wallet || 0,
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleNavigation = (page) => {
    // Navigate to the respective page based on button clicked
    switch (page) {
      case 'product':
        navigate('/product'); // Navigate to Products page
        break;
      case 'submitTaskLog':
        navigate('/submit-task'); // Navigate to Submit Task Log page
        break;
      case 'transactionHistory':
        navigate('/transHist'); // Navigate to Transaction History page
        break;
      default:
        break;
    }
  };

  return (
    <div className="user-dashboard" style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
      <button 
        onClick={() => navigate('/')} 
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

      <button 
        onClick={() => navigate('/u-auc')} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' ,
          width: 200,
          backgroundColor: 'blue'
        }}
      >Auction</button>
      <header className="dashboard-header" >
        
        <h1>Welcome Back, {userData.name}!</h1>
        <p>Choose a section to get started.</p>
      </header>

      <div className="button-grid">
        {/* Top Right Section (User Info) */}
        <div className="section-card user-info">
          <h2>User Info</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Wallet Balance:</strong> ${userData.wallet.toFixed(2)}</p>
            </>
          )}
        </div>

        {/* Grid Sections for Other Actions */}
        <div className="section-card">
          <h2>Products</h2>
          <p>View available products.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('product')}
          >
            Go to Products
          </button>
        </div>

        <div className="section-card">
          <h2>Submit Task Log</h2>
          <p>Submit a task log for completed work.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('submitTaskLog')}
          >
            Go to Submit Task Log
          </button>
        </div>

        <div className="section-card">
          <h2>Transaction History</h2>
          <p>View your transaction history.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('transactionHistory')}
          >
            Go to Transaction History
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDash;
