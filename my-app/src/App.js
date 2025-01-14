import React, { useState } from 'react';
import StaffPage from './StaffPage.js';
import UserPage from './UserPage.js';
import './App.css'; // Importing CSS for styling

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="app">
      {view === 'home' && (
        <div className="home">
          <h1 className="title">Welcome to <span>Mohammadiyah</span></h1>
          <p className="subtitle">Choose your portal to log in or sign up:</p>
          <div className="button-group">
            <button className="custom-button" onClick={() => setView('staff')}>
              Staff Portal
            </button>
            <button className="custom-button" onClick={() => setView('user')}>
              User Portal
            </button>
          </div>
        </div>
      )}
      {view === 'staff' && <StaffPage goBack={() => setView('home')} />}
      {view === 'user' && <UserPage goBack={() => setView('home')} />}
    </div>
  );
}

export default App;
