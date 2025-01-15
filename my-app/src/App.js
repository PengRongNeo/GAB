import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StaffPage from './StaffPage.js';
import UserPage from './UserPage.js';
import UserDash from './UserDash.js';  // Assuming you created UserDash
import StaffDash from './StaffDash.js';  // Assuming you created StaffDash
import TransactionHist from './TransactionHist.js';
import HandleRequest from './HandleRequest.js';
import SubmitTaskLog from './SubmitTaskLog.js';
import Product from './Product.js';
import AdminProductPage from './ProductMgmt.js';

import './App.css'; // Importing CSS for styling

function App() {
  const [view, setView] = useState('home');
  return (
    <Router>  {/* Wrap everything in Router */}
      <Routes>
        {/* Home Page route */}
        <Route path="/" element={
           <div className="app">
           {view === 'home' && (
             <div className="home">
               <h1 className="title">Welcome to <br /><span>MWH Minimart</span></h1>
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
           {view === 'test' && <Product goBack={() => setView('home')} />}
         </div>
        } />
        
        {/* StaffPage route */}
        <Route path="/staff" element={<StaffPage />} />
        
        {/* UserPage route */}
        <Route path="/user" element={<UserPage />} />
        
        {/* UserDash route */}
        <Route path="/user-dash" element={<UserDash />} /> 
        
        {/* StaffDash route */}
        <Route path="/staff-dash" element={<StaffDash />} /> 

        {/* TransactionHist route */}
        <Route path="/transHist" element={<TransactionHist />} /> 

        {/* SubmitTaskLog route */}
        <Route path="/submit-task" element={<SubmitTaskLog />} /> 

        {/* Handle Requests */}
        <Route path="/handle-req" element={<HandleRequest />} /> 

        {/* Handle Requests */}
        <Route path="/product" element={<Product />} /> 

        {/* Handle Requests */}
        <Route path="/product-manage" element={<AdminProductPage />} /> 


      </Routes>
    </Router>
  );
}

export default App;
