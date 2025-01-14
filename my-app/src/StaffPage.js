import React from 'react';

function StaffPage({ goBack }) {
  return (
    <div className="portal">
      <h1>Staff Login</h1>
      <form>
        <input type="text" placeholder="Staff ID" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Log In</button>
      </form>
      <button onClick={goBack}>Back to Home</button>
    </div>
  );
}

export default StaffPage;
