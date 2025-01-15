import React, { useState, useEffect } from 'react';
import './ProductMgmt.css';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

function Notification({ message, type }) {
  if (!message) return null;

  const notificationStyle = {
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: '5px',
    color: type === 'error' ? '#fff' : '#222',
    backgroundColor: type === 'error' ? '#ff4d4d' : '#ffcc80',
    textAlign: 'center',
    fontWeight: 'bold',
  };

  return <div style={notificationStyle}>{message}</div>;
}

function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    qty: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Fetch products from Firestore on mount
  useEffect(() => {
    const productsRef = collection(db, 'products');

    // Listen for real-time updates
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setFilteredProducts(productsData); // Set filtered to initial data
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(results);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilter = (order) => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return order === 'low-to-high' ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sortedProducts);
    setIsFilterOpen(false); // Close filter dropdown
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, price, qty, image } = newProduct;

    if (!name || !price || !qty || !image) {
      setError('All fields are required.');
      setNotification('');
      return;
    }

    if (isNaN(price) || isNaN(qty)) {
      setError('Price and Quantity must be numeric values.');
      setNotification('');
      return;
    }

    try {
      const productRef = doc(collection(db, 'products')); // Auto-generate ID
      await setDoc(productRef, {
        name,
        price: parseFloat(price),
        qty: parseInt(qty, 10),
        image,
      });

      setNewProduct({ name: '', price: '', qty: '', image: '' });
      setError('');
      setNotification('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Try again.');
      setNotification('');
    }
  };

  const handleUpdateQty = async (id, adjustment) => {
    try {
      const productRef = doc(db, 'products', id);
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const newQty = product.qty + adjustment;

      if (newQty < 0) {
        setNotification('Quantity cannot be negative.');
        return;
      }

      await updateDoc(productRef, { qty: newQty });

      setNotification(`Quantity updated to ${newQty}!`);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setNotification('Failed to update quantity. Try again.');
    }
  };

  return (
    <div className="product-page full-screen">
      <header className="product-header">
        <h1>Admin Product Management</h1>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          <div className="filter-dropdown">
            <button onClick={toggleFilter} className="filter-button">
              Filter
            </button>
            {isFilterOpen && (
              <div className="filter-options">
                <button onClick={() => handleFilter('low-to-high')}>
                  Price: Low to High
                </button>
                <button onClick={() => handleFilter('high-to-low')}>
                  Price: High to Low
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Notification message={error || notification} type={error ? 'error' : 'success'} />

      <div className="product-container" style={{height: 1200}}>
        <div>
          <h2>Product List</h2>
          <div className="product-list" style={{height: 500}}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`product-box ${product.qty < 5 ? 'low-stock' : ''}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Quantity: {product.qty}</p>
                <div className="qty-adjust-container">
                  <button
                    className="qty-button decrease"
                    onClick={() => handleUpdateQty(product.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="qty-button increase"
                    onClick={() => handleUpdateQty(product.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="add-product">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="form-input"
              style = {{width: 300}}
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="form-input"
              style = {{width: 300}}
            />
            <input
              type="text"
              name="qty"
              placeholder="Quantity"
              value={newProduct.qty}
              onChange={handleInputChange}
              className="form-input"
              style = {{width: 300}}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={handleInputChange}
              className="form-input"
              style = {{width: 300}}
            />
            <button type="submit" className="add-button">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProductPage;
