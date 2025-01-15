import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  // Fetch transactions from Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'transactionhist'), where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        const transactionsList = [];
        querySnapshot.forEach((doc) => {
         const data = doc.data();
          const transaction = {
            id: doc.id,
            date: new Date(data.date), // Correctly parse the ISO string to Date object
            products: data.products,
            total: data.price,
          };
          transactionsList.push(transaction);
        });


        setTransactions(transactionsList);
        setFilteredTransactions(transactionsList); // Initially show all transactions
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  // Filter transactions by date range
  const filterTransactionsByDateRange = (start, end) => {
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0); // Set start date to the beginning of the day
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Set end date to the end of the day
    const endDateInclusive = new Date(endDate);
    endDateInclusive.setDate(endDateInclusive.getDate()); // Add one day to include the end date

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date); // Convert Firestore Timestamp to Date
      return transactionDate >= startDate && transactionDate <= endDateInclusive;
    });

    setFilteredTransactions(filtered);
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      filterTransactionsByDateRange(startDate, endDate);
    }
  };

  if (loading) {
    return <p>Loading transaction history...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="transaction-history-fullscreen" style={{ padding: '20px', maxWidth: '90%', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/user-dash')} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          padding: '10px 20px', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' ,
          width:100,
          backgroundColor: 'black'
        }}
      >
        Back
      </button>
      <h1>Transaction History</h1>

      {/* Date Range Filter */}
      <div className="date-filter" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={handleDateChange} style={{ padding: 10, margin: 20, backgroundColor: 'grey', color: 'white'}}>
          Apply Filter
        </button>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
        <div className="transactions-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
              {/* Transaction Date */}
              <div className="transaction-header">
                <p>
                  <strong>Date of Purchase:</strong>{' '}
                  {transaction.date.toLocaleDateString()}
                </p>
              </div>
              {/* Product List */}
              <div className="transaction-details">
                <p><strong>Products Purchased:</strong></p>
                <ul>
                  {transaction.products.map((product, index) => (
                    <li key={index}>
                      <strong>{product.name}</strong>: {product.qty}
                    </li>
                  ))}
                  <p><strong>{transaction.total}</strong></p>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No transactions found for the selected date range.</p>
      )}
    </div>
  );
}

export default TransactionHistory;
