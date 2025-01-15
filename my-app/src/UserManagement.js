import React, { useState, useEffect } from 'react';
import './UserManagement.css'; // Add any necessary styles
import { db, getDocs, collection } from './firebase'; // import firebase configuration

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    // Fetch users from Firestore using the modular SDK
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map(user => user.id)); // Select all
    }
  };

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId)); // Deselect user
    } else {
      setSelectedUsers([...selectedUsers, userId]); // Select user
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="user-management-container">
      {/* Title */}
      <h1 className="page-title">User Management</h1>

      <header className="user-management-header">
        <div className="header-left">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>

        <div className="header-right">
          <button onClick={handleSelectAll} className="select-all-button">
            Select All
          </button>
        </div>
      </header>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Email</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {/* Add more user data here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="user-management-actions">
        <button className="action-button">Add Voucher</button>
        <button className="action-button">Reset Password</button>
        <button className="action-button">Suspend User</button>
      </div>
    </div>
  );
};

export default UserManagement;



