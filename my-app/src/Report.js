import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Firebase config
import { collection, query, getDocs } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';

function Report() {
  const [weeklySales, setWeeklySales] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'transactionhist'));
        const querySnapshot = await getDocs(q);
  
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
  
        const salesData = {};
        const itemSales = {};
        let totalYearlySales = 0;
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const transactionDate = new Date(data.date);
  
          // Filter transactions within the last 7 days
          if (transactionDate >= sevenDaysAgo && transactionDate <= today) {
            const day = transactionDate.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
  
            // Aggregate daily sales
            salesData[day] = (salesData[day] || 0) + data.total;
  
            // Aggregate item popularity
            data.products.forEach((product) => {
              itemSales[product.name] = (itemSales[product.name] || 0) + product.qty;
            });
          }

          // Aggregate total sales for the year
          const year = transactionDate.getFullYear();
          if (transactionDate.getFullYear() === today.getFullYear()) {
            totalYearlySales += data.total;
          }
        });
  
        // Transform data into arrays for visualization
        const dailySalesArray = Object.entries(salesData).map(([day, total]) => ({ day, total }));
        const sortedItemSales = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
  
        setWeeklySales(dailySalesArray);
        setPopularItems(sortedItemSales);
        setTotalSales(totalYearlySales);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) {
    return <p>Loading report...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Reverse the weekly sales array to show the most recent sales at the end (left to right)
  const reversedWeeklySales = [...weeklySales].reverse();

  // Data for Weekly Sales Line Chart
  const lineChartData = {
    labels: reversedWeeklySales.map((entry) => entry.day), // Use reversed order of days
    datasets: [
      {
        label: 'Daily Sales ($)',
        data: reversedWeeklySales.map((entry) => entry.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true, // No fill under the line
        tension: 0.3, // Smooth curve for the line
      },
    ],
  };

  // Data for Popular Items Bar Chart
  const itemBarChartData = {
    labels: popularItems.slice(0, 5).map(([name]) => name), // Top 5 most popular items
    datasets: [
      {
        label: 'Item Sales Quantity',
        data: popularItems.slice(0, 5).map(([, qty]) => qty),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options to hide labels until hover
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw + ' sold'; // Custom tooltip label to show quantity sold
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Hide labels on the x-axis
        },
      },
      y: {
        ticks: {
          display: false, // Hide labels on the y-axis
        },
      },
    },
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '10px', maxWidth: '1200px', margin: '0 auto', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <button 
          onClick={() => navigate('/staff-dash')} 
          style={{ 
            position: 'absolute', 
            top: '10px', 
            left: '10px', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            width: 100,
            backgroundColor: 'black', 
            zIndex: 1
          }}
        >
          Back
        </button>

        <h1 style={{ borderBottom: '2px solid #ff6f00', paddingBottom: '10px', color: '#ff6f00' }}>Weekly Sales Report</h1>
      </div>

      {/* 2x2 Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Weekly Sales Line Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#007bff' }}>Sales this Week</h2>
          <Line data={lineChartData} options={barChartOptions} />
        </div>

        {/* Popular Items Bar Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#007bff' }}>Top 5 Popular Items</h2>
          <Bar data={itemBarChartData} options={barChartOptions} />
        </div>

        {/* Sales Insights */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#007bff' }}>Detailed Sales Insights</h2>
          <p><strong>Total Sales for the Year:</strong> ${totalSales.toFixed(2)}</p>
          <p><strong>Average Daily Sales (Last 7 Days):</strong> ${(
            weeklySales.reduce((acc, curr) => acc + curr.total, 0) / weeklySales.length
          ).toFixed(2)}</p>
          <p><strong>Total Transactions (Last 7 Days):</strong> {weeklySales.length}</p>
        </div>

        {/* Sales Summary */}
        <div style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Sales Summary</h3>
          <p><strong>Total Sales:</strong> ${totalSales.toFixed(2)}</p>
          <p><strong>Items Sold:</strong> {popularItems.slice(0, 5).reduce((acc, [, qty]) => acc + qty, 0)}</p>
        </div>
        
      </div>
    </div>
  );
}

export default Report;
