import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

function StaffDash() {
  const navigate = useNavigate();  // Initialize the navigate hook

  // Function to handle navigation to different pages
  const handleNavigation = (page) => {
    navigate(`/${page}`);  // Navigate to the specified page
  };

  return (
    <div className="staff-dashboard">
      <h1>Welcome to the Staff Dashboard</h1>
      <div className="button-group">
        <button
          className="custom-button"
          onClick={() => handleNavigation('product-management')}
        >
          Product Management
        </button>
        <button
          className="custom-button"
          onClick={() => handleNavigation('handle-requests')}
        >
          Handle Requests
        </button>
        <button
          className="custom-button"
          onClick={() => handleNavigation('user-management')}
        >
          User Management
        </button>
      </div>
    </div>
  );
}

export default StaffDash;
