import React, { useState, useEffect } from "react";
import { getCartFromFirestore } from "./firebase"; // Import your Firebase function
import { auth } from "./firebase"; // Make sure to import Firebase Auth
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(""); // State to hold the selected voucher
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Simulate a list of vouchers the user can choose from
  const vouchers = [
    { id: "voucher1", name: "10% Discount Voucher" },
    { id: "voucher2", name: "Free Delivery Voucher" },
    { id: "voucher3", name: "Buy One Get One Free Voucher" },
  ];

  // Fetch the user's cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser; // Get the current authenticated user
      if (user) {
        const items = await getCartFromFirestore(user.uid); // Fetch cart items from Firestore
        setCartItems(items); // Set the cart items state
      }
    };

    fetchCart();
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

  const handlePlaceOrder = () => {
    // Trigger modal to show success message
    setIsModalOpen(true);
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
        <h2>Select Voucher</h2>
        <div className="voucher-options">
          <select
            value={selectedVoucher}
            onChange={(e) => setSelectedVoucher(e.target.value)} // Update the selected voucher
          >
            <option value="">Select a voucher</option>
            {vouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handlePlaceOrder}>Place Order</button>
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
