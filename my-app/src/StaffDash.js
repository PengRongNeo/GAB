import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './StaffDash.css'; // Import a separate CSS file for styling

function StaffDash() {
  const navigate = useNavigate();  // Initialize the navigate hook

  // Function to handle navigation to different pages
  const handleNavigation = (page) => {
    navigate(`/${page}`);  // Navigate to the specified page
  };

  return (
    <div className="staff-dashboard">
      <header className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <p>Welcome back! Choose a section to manage.</p>
      </header>

      <div className="dashboard-body">
        <div className='button-grid'>
        <div className="section-card">
          <h2>Product Management</h2>
          <p>Manage products, prices, and inventory.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('product-manage')}
          >
            Go to Product Management
          </button>
        </div>

        <div className="section-card">
          <h2>Handle Requests</h2>
          <p>View and handle incoming requests from customers.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('handle-req')}
          >
            Go to Handle Requests
          </button>
        </div>

        <div className="section-card">
          <h2>User Management</h2>
          <p>Manage users, roles, and account settings.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('user-management')}
          >
            Go to User Management
          </button>
        </div>

        <div className="section-card">
          <h2>Task Management</h2>
          <p>View and manage tasks assigned to staff members.</p>
          <button
            className="custom-button"
            onClick={() => handleNavigation('task-manage')}
          >
            Go to Task Management
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default StaffDash;
