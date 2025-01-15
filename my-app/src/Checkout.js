import React, { useState, useEffect } from "react";
import { getCartFromFirestore, getUserWalletBalance, updateWalletBalance } from "./firebase"; // Import Firebase functions
import { auth } from "./firebase"; // Import Firebase Auth
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); // State to hold wallet balance
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch the user's cart and wallet balance from Firestore
  useEffect(() => {
    const fetchCartAndWallet = async () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        // Fetch cart items
        const items = await getCartFromFirestore(user.uid);
        setCartItems(items); // Set the cart items state
        
        // Fetch wallet balance
        const wallet = await getUserWalletBalance(user.uid);
        setWalletBalance(wallet); // Set wallet balance
      }
    };

    fetchCartAndWallet();
  }, []); // Empty dependency array, so this runs once when the component mounts

  // Calculate total price with validation and conversion
  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      // Ensure price and quantity are valid numbers
      const price = parseFloat(item.price); // Convert price to a number
      const quantity = parseInt(item.cartQty, 10); // Convert quantity to an integer

      // Only add to total if both price and quantity are valid numbers
      if (!isNaN(price) && !isNaN(quantity)) {
        return total + price * quantity;
      } else {
        console.error("Invalid item data:", item);
        return total;
      }
    }, 0);

  // Handle order placement
  const handlePlaceOrder = async () => {
    const totalAmount = calculateTotal();

    if (walletBalance >= totalAmount) {
      // Deduct the total amount from the wallet
      const newBalance = walletBalance - totalAmount;

      // Update the wallet balance in Firestore
      await updateWalletBalance(auth.currentUser.uid, newBalance);

      // Update the wallet balance state to reflect the new balance
      setWalletBalance(newBalance);

      // Show modal
      setIsModalOpen(true);
    } else {
      // Display message or do something when wallet balance is insufficient
      alert("Insufficient balance to place the order.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item) => {
              // Ensure price and quantity are valid before displaying
              const price = parseFloat(item.price);
              const quantity = parseInt(item.cartQty, 10);
              const itemTotal = !isNaN(price) && !isNaN(quantity) ? price * quantity : 0;

              return (
                <li key={item.id}>
                  <div className="item-details">
                    {/* Product Name */}
                    <span>{item.name}</span>
                    {/* Quantity x Price */}
                    <span style={{ marginLeft: "20px" }}>
                      {quantity} x ${price.toFixed(2)}
                    </span>
                    {/* Total amount */}
                    <span style={{ marginLeft: "20px" }}>
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Your cart is empty!</p>
        )}
        <div className="total">
          <strong>Total:</strong> ${calculateTotal().toFixed(2)}
        </div>
      </div>

      <div className="checkout-form">
        <h2>Wallet Balance</h2>
        <div className="wallet-balance">
          <p>Your Wallet Balance: ${walletBalance.toFixed(2)}</p>
        </div>

        <button onClick={handlePlaceOrder} disabled={walletBalance < calculateTotal()}>
          Place Order
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Placed Successfully!</h2>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
