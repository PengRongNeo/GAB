import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firebase config
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AdminAuction.css'; // Import the CSS file

function AdminAuction() {
  const [auctionItems, setAuctionItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', currBidder: '', currPrice: '', image: '', timer: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to format the remaining time
  const formatTime = (remainingTime) => {
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Handle fetching the auction items from Firestore
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
      } finally {
        setLoading(false);
      }
    };
    fetchAuctionItems();
  }, []);

  // Handle adding a new item to the auction
  const handleAddItem = async (e) => {
    e.preventDefault();
    const timerDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    try {
      const newItemRef = await addDoc(collection(db, 'Auction'), {
        name: newItem.name,
        currBidder: newItem.currBidder,
        currPrice: parseFloat(newItem.currPrice),
        image: newItem.image,
        timer: new Date().getTime() + timerDuration, // Set timer to 1 week from now
      });
      setAuctionItems([...auctionItems, { id: newItemRef.id, ...newItem, timer: new Date().getTime() + timerDuration }]);
      setNewItem({ name: '', currBidder: '', currPrice: '', image: '', timer: '' });
    } catch (err) {
      console.error('Error adding auction item:', err);
    }
  };

  // Complete auction item and deduct wallet balance
  const completeAuction = async (itemId) => {
    try {
      const itemDocRef = doc(db, 'Auction', itemId);
      const itemSnapshot = await getDocs(itemDocRef);
      const item = itemSnapshot.data();

      const userDocRef = doc(db, 'Users', item.currBidder);
      const userSnapshot = await getDocs(userDocRef);
      const user = userSnapshot.data();

      // Deduct wallet balance from the current bidder
      if (user.wallet >= item.currPrice) {
        await updateDoc(userDocRef, {
          wallet: user.wallet - item.currPrice,
        });
      }

      // Delete auction item from Firestore
      await deleteDoc(itemDocRef);
      setAuctionItems(auctionItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error completing auction:', err);
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
    <div className="admin-auction-container">
      <button 
          onClick={() => navigate('/staff-dash')} 
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

      <div>
        {/* Add Item Form */}
        <div className="add-item-form">
          <h2>Add Auction Item</h2>
          <form onSubmit={handleAddItem}>
            <input 
              type="text" 
              name="name" 
              placeholder="Item Name" 
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
              style={{width:300}}
            />
            <input 
              type="text" 
              name="currBidder" 
              placeholder="Current Bidder Email"
              value={newItem.currBidder}
              onChange={(e) => setNewItem({ ...newItem, currBidder: e.target.value })}
              required
              style={{width:300}}
            />
            <input 
              type="number" 
              name="currPrice" 
              placeholder="Current Price"
              value={newItem.currPrice}
              onChange={(e) => setNewItem({ ...newItem, currPrice: e.target.value })}
              required
              style={{width:300}}
            />
            <input 
              type="url" 
              name="image" 
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              required
              style={{width:300}}
            />
            <button type="submit">Add Item</button>
          </form>
        </div>
      </div>

      {/* Auction Items List */}
      {loading ? (
        <p>Loading auction items...</p>
      ) : (
        <div className="auction-items-list">
          {auctionItems.map((item) => (
            <div className="auction-item" key={item.id}>
              <h3>{item.name}</h3>
              <p>Current Price: ${item.currPrice}</p>
              <img src={item.image} alt={item.name} />
              <div className="timer-box">
                Time Remaining: 
                <span className="time-remaining">
                  {formatTime(item.remainingTime)}
                </span>
              </div>
              <button 
                onClick={() => completeAuction(item.id)} 
                disabled={item.remainingTime > 0}
              >
                Complete Auction
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAuction;
