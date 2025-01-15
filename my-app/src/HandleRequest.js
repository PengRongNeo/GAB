import React, { useState, useEffect } from 'react';
import './HandleRequest.css';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import Firebase configuration

const HandleRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [filterBy, setFilterBy] = useState('name'); // Default filter option
  const [modifiedStatuses, setModifiedStatuses] = useState({}); // Track changes

  useEffect(() => {
    // Fetch requests from Firestore
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'requests'));
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firebase document ID
          ...doc.data(),
        }));
        setRequests(requestsData);
      } catch (e) {
        console.error('Error getting documents: ', e);
      }
    };

    fetchRequests();
  }, []); // Empty dependency array means this will run once when the component mounts

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleStatusChange = (index, newStatus) => {
    const requestId = requests[index].id;

    // Track changes locally
    setModifiedStatuses((prev) => ({
      ...prev,
      [requestId]: newStatus,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updates = Object.entries(modifiedStatuses).map(async ([id, newStatus]) => {
        const requestDocRef = doc(db, 'requests', id);
        await updateDoc(requestDocRef, { status: newStatus });
      });

      await Promise.all(updates); // Wait for all updates to complete

      // Update the UI
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          modifiedStatuses[request.id]
            ? { ...request, status: modifiedStatuses[request.id] }
            : request
        )
      );
      setModifiedStatuses({}); // Clear the modified statuses
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes: ', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const filteredRequests = requests
  .filter((request) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (filterBy === 'name') {
      return request.name && request.name.toLowerCase().includes(lowerCaseSearchTerm);
    } else if (filterBy === 'date') {
      return request.date && request.date.includes(lowerCaseSearchTerm);
    }
    return true;
  })
  .sort((a, b) => {
    if (filterBy === 'date') {
      return new Date(a.date) - new Date(b.date); // Sort from earliest to latest
    }
    return 0; // No additional sorting for other filters
  });


  return (
    <div className="handle-request full-screen">
      <h1 className="page-title">Handle Request</h1>
      <div className="header">
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Filter by Name</option>
          <option value="date">Filter by Date</option>
        </select>
      </div>
      <div className="table-container">
        {filteredRequests.length > 0 ? (
          <>
            <table className="request-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.name}</td>
                    <td>{request.product}</td>
                    <td>{request.quantity}</td>
                    <td>{request.date}</td>
                    <td>
                      <select
                        className={`status-select status-${request.status}`}
                        value={
                          modifiedStatuses[request.id] || request.status // Use modified status if available
                        }
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                      >
                        <option value="unfulfilled">Unfulfilled</option>
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="save-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </>
        ) : (
          <div className="no-results">No matching results</div>
        )}
      </div>
    </div>
  );
};

export default HandleRequest;
