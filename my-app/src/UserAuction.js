import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Firebase config
import { collection, query, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './UserAuction.css'; // Import the CSS file

function UserAuction() {
  const [auctionItems, setAuctionItems] = useState([]);
  const [user, setUser] = useState(null); // Store user information (balance, etc.)
  const [userBid, setUserBid] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(''); // Notification state
  const navigate = useNavigate();

  // Helper function to format the remaining time
  const formatTime = (remainingTime) => {
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Fetch auction items and user data from Firestore
  useEffect(() => {
    const fetchAuctionItems = async () => {
      try {
        const q = query(collection(db, 'Auction'));
        const querySnapshot = await getDocs(q);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setAuctionItems(items);
      } catch (err) {
        console.error('Error fetching auction items:', err);
      }
    };

    const fetchUser = async () => {
      const userId = auth.currentUser?.uid; // Retrieve user ID
      if (!userId) {
        console.error('User not authenticated');
        return; // Stop execution if the user is not authenticated
      }
  
      const userRef = doc(db, 'users', userId);
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data()); // Correctly set user data
        } else {
          console.error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user: ', error);
      }
    };

    // Fetch items and user data
    fetchAuctionItems();
    fetchUser().finally(() => {
      setLoading(false); // Ensure loading is set to false after both fetches
    });
  }, []); // Empty dependency array to run the effect only once

  // Handle bidding on an item
  const handleBid = async (itemId, newBidPrice) => {
    if (!user) {
      alert('User data is not available. Please try again later.');
      return;
    }
  
    if (user.wallet >= newBidPrice) {
      try {
        const itemDocRef = doc(db, 'Auction', itemId);
  
        // Update auction item with new bid
        await updateDoc(itemDocRef, {
          currBidder: auth.currentUser.email, // Use dynamic user email
          currPrice: newBidPrice, // Update current price
        });
  
        // Optionally, update the user's wallet balance
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          wallet: user.wallet - newBidPrice,
        });
  
        // Update the userBid state for the item, clearing the input value
        setUserBid((prevState) => ({
          ...prevState,
          [itemId]: '', // Clear the bid input field after successful bid
        }));
  
        // Display success notification
        setNotification('Your bid was successful!');
  
        // Reset notification after 3 seconds
        setTimeout(() => {
          setNotification('');
        }, 3000);
      } catch (err) {
        console.error('Error placing bid:', err);
      }
    } else {
      alert('Insufficient balance!');
    }
  };
  

  // Real-time countdown logic for the timer
  const calculateRemainingTime = (endTime) => {
    const currentTime = new Date().getTime();
    const timeRemaining = endTime - currentTime;
    return timeRemaining > 0 ? timeRemaining : 0;
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          remainingTime: calculateRemainingTime(item.timer),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [auctionItems]);

  return (
    <div className="user-auction-container">
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
            zIndex: 1
          }}
        >
          Back
        </button>
      {/* Notification Box */}
      {notification && <div className="notification">{notification}</div>}

      <header className="auction-header">
        <h2 style={{color:'white'}}>Current Auction Items</h2>
      </header>

      <div className="auction-items-container">
        {loading ? (
          <p>Loading auction items...</p>
        ) : (
          <div className="auction-items-list">
            {auctionItems.map((item) => (
              <div className="auction-item" key={item.id}>
                <h3>{item.name}</h3>
                <img src={item.image} alt={item.name} />
                <p>Current Price: ${item.currPrice}</p>
                <p>Time Remaining: {formatTime(item.remainingTime)}</p>

                {/* Display bid input if timer has not ended */}
                {item.remainingTime > 0 ? (
                  <>
                    <input
                      type="number"
                      value={userBid[item.id] || ''}
                      onChange={(e) =>
                        setUserBid({ ...userBid, [item.id]: e.target.value })
                      }
                      placeholder="Your Bid"
                    />
                    <button
                      onClick={() =>
                        handleBid(item.id, parseFloat(userBid[item.id]))
                      }
                      disabled={item.currBidder === auth.currentUser?.email}
                    >
                      Place Bid
                    </button>
                  </>
                ) : (
                  <button disabled>Timer Expired</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserAuction;
