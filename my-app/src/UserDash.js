import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use this for navigation in React Router v6

function UserDash() {
  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  const handleNavigation = (page) => {
    // Navigate to the respective page based on button clicked
    switch (page) {
      case 'products':
        navigate('/products'); // Navigate to Products page
        break;
      case 'submitTaskLog':
        navigate('/submit-task-log'); // Navigate to Submit Task Log page
        break;
      case 'transactionHistory':
        navigate('/transaction-history'); // Navigate to Transaction History page
        break;
      default:
        break;
    }
  };

  return (
    <div className="user-dashboard">
      <h1>Welcome to the User Dashboard</h1>
      <div className="button-group">
        <button
          className="custom-button"
          onClick={() => handleNavigation('products')}
        >
          Products
        </button>
        <button
          className="custom-button"
          onClick={() => handleNavigation('submitTaskLog')}
        >
          Submit Task Log
        </button>
        <button
          className="custom-button"
          onClick={() => handleNavigation('transactionHistory')}
        >
          Transaction History
        </button>
      </div>
    </div>
  );
}

export default UserDash;
