import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartFromFirestore,
  getUserWalletBalance,
  updateWalletBalance,
  clearCartInFirestore,
  addTransactionToFirestore, // Import function to add transaction
} from "./firebase"; // Ensure Firebase functions are correctly imported
import { auth } from "./firebase";
import "./Checkout.css";
import { v4 as uuidv4 } from "uuid"; // Import UUID for transactionID

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndWallet = async () => {
      const user = auth.currentUser;
      if (user) {
        const items = await getCartFromFirestore(user.uid);
        setCartItems(items);

        const wallet = await getUserWalletBalance(user.uid);
        setWalletBalance(wallet);
      }
    };

    fetchCartAndWallet();
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.cartQty, 10);

      if (!isNaN(price) && !isNaN(quantity)) {
        return total + price * quantity;
      } else {
        console.error("Invalid item data:", item);
        return total;
      }
    }, 0);

  const handlePlaceOrder = async () => {
    const totalAmount = calculateTotal();

    if (walletBalance >= totalAmount) {
      const user = auth.currentUser;
      const userId = user.uid;
      const newBalance = walletBalance - totalAmount;

      try {
        // Generate transactionID
        const transactionID = uuidv4();

        // Add transaction to Firestore
        await addTransactionToFirestore({
          date: new Date().toISOString(),
          email: user.email,
          products: cartItems.map(({ name, cartQty }) => ({
            name,
            qty: cartQty,
          })),
          transactionID,
        });

        await updateWalletBalance(userId, newBalance);
        await clearCartInFirestore(userId);

        setWalletBalance(newBalance);
        setCartItems([]);
        setIsOrderPlaced(true);
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    } else {
      alert("Insufficient balance to place the order.");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {isOrderPlaced ? (
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <div className="wallet-balance">
            <p>Your Wallet Balance: ${walletBalance.toFixed(2)}</p>
          </div>
          <button onClick={() => navigate("/product")} className="back-button">
            Back to Products
          </button>
        </div>
      ) : (
        <>
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {cartItems.length > 0 ? (
              <ul>
                {cartItems.map((item) => {
                  const price = parseFloat(item.price);
                  const quantity = parseInt(item.cartQty, 10);
                  const itemTotal = !isNaN(price) && !isNaN(quantity) ? price * quantity : 0;

                  return (
                    <li key={item.id}>
                      <div className="item-details">
                        <span>{item.name}</span>
                        <span style={{ marginLeft: "20px" }}>
                          {quantity} x ${price.toFixed(2)}
                        </span>
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
            <button onClick={() => navigate("/product")} className="back-button">
              Back to Products
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
