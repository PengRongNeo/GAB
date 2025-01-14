import React from 'react';

function UserPage({ goBack }) {
  return (
    <div className="portal">
      <h1>User Login</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Log In</button>
      </form>
      <button onClick={goBack}>Back to Home</button>
    </div>
  );
}

export default UserPage;
