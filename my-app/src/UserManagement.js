import React, { useState, useEffect } from 'react';
import './UserManagement.css'; // Add any necessary styles
import { db, getDoc, doc, updateDoc, increment, collection, getDocs } from './firebase'; // Correct import
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase Authentication
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [updateAmount, setUpdateAmount] = useState(''); // Track amount to update wallet
  const [error, setError] = useState(''); // To handle any error in the input
  const [selectedUsersData, setSelectedUsersData] = useState([]); // Store the data of selected users

  useEffect(() => {
    // Fetch users from Firestore
    getDocs(collection(db, 'users')).then((querySnapshot) => {
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    });
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

  const handleEditWalletClick = () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user to edit the wallet.');
      return;
    }

    // Fetch the data for all selected users
    const selectedUsersDocs = selectedUsers.map(userId => {
      return getDoc(doc(db, 'users', userId)).then(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
    });

    Promise.all(selectedUsersDocs)
      .then(usersData => {
        setSelectedUsersData(usersData); // Store the selected users' data
        setIsModalOpen(true); // Open the modal to edit wallet
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data. Please try again.');
      });
  };

  const handleUpdateAmountChange = (e) => {
    setUpdateAmount(e.target.value);
    setError(''); // Reset error when the user starts typing
  };

  const handleUpdateWallets = (isAdd) => {
    const amount = parseFloat(updateAmount);
    if (isNaN(amount)) {
      setError('Please enter a valid number.');
      return;
    }

    // Update the wallet for all selected users
    const updatePromises = selectedUsers.map(userId => {
      const userDocRef = doc(db, 'users', userId);
      return updateDoc(userDocRef, {
        wallet: increment(isAdd ? amount : -amount), // Add or subtract the entered amount
      });
    });

    // Perform the update for all users
    Promise.all(updatePromises)
      .then(() => {
        console.log(`Wallets updated for users: ${selectedUsers.join(', ')}`);
        setIsModalOpen(false); // Close the modal after updating
        setUpdateAmount(''); // Clear the input
      })
      .catch((error) => {
        console.error('Error updating wallet:', error);
        setError('Error updating wallet. Please try again.');
      });
  };

  // Handle reset password for selected users
  const handleResetPassword = () => {
    if (selectedUsers.length !== 1) {
      setError('Please select exactly one user to reset the password.');
      return;
    }

    const userId = selectedUsers[0];
    const userDocRef = doc(db, 'users', userId); // Get the user's document reference

    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const email = docSnapshot.data().email;
          const auth = getAuth();

          // Send the password reset email
          sendPasswordResetEmail(auth, email)
            .then(() => {
              console.log(`Password reset email sent to ${email}`);
              setError('');
              toast.success('Password reset email sent successfully!', {
                position: 'top-center', // Centered toast
                autoClose: 5000,
                hideProgressBar: true,
                closeButton: false,
                draggable: true,
                theme: 'colored', // Optional: You can customize the theme (light, dark, colored)
              });
            })
            .catch((error) => {
              console.error('Error sending reset email:', error);
              setError('Error sending reset email. Please try again.');
              toast.error('Error sending reset email. Please try again.', {
                position: 'top-center', // Centered toast
                autoClose: 5000,
                hideProgressBar: true,
                closeButton: false,
                draggable: true,
                theme: 'colored', // Optional: You can customize the theme (light, dark, colored)
              });
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
        toast.error('Error fetching user data. Please try again.', {
          position: 'top-center', // Centered toast
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: false,
          draggable: true,
          theme: 'colored', // Optional: You can customize the theme (light, dark, colored)
        });
      });
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
              <th>Wallet</th>
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
                <td>{user.wallet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="user-management-actions">
        <button className="action-button" onClick={handleEditWalletClick}>
          Edit Wallet
        </button>
        <button className="action-button" onClick={handleResetPassword}>
          Reset Password
        </button>
        <button className="action-button">Suspend User</button>
      </div>

      {/* Modal for Edit Wallet */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Wallet for {selectedUsersData.length} Users</h2>
            {/* Removed current wallet balance display */}
            <input
              type="text"
              value={updateAmount}
              onChange={handleUpdateAmountChange}
              placeholder="Enter amount to increase/decrease"
              className="voucher-input"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button onClick={() => handleUpdateWallets(true)} className="add-button">
                Add
              </button>
              <button onClick={() => handleUpdateWallets(false)} className="deduct-button">
                Deduct
              </button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
