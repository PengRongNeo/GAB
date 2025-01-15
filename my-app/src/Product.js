import React, { useState } from 'react';
import './Product.css';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { db, doc, updateDoc, auth, getDoc, setDoc} from './firebase'; // Adjust path as needed

const productsData = [
  {
    id: 1,
    name: 'Apple',
    price: 2.5,
    qty: 10,
    image: 'https://media.istockphoto.com/id/184276818/photo/red-apple.jpg?s=612x612&w=0&k=20&c=NvO-bLsG0DJ_7Ii8SSVoKLurzjmV0Qi4eGfn6nW3l5w=',
  },
  {
    id: 2,
    name: 'Banana',
    price: 1.5,
    qty: 3,
    image: 'https://static.wixstatic.com/media/53e8bb_a1e88e551162485eb4ff962437300872~mv2.jpeg/v1/crop/x_0,y_105,w_1024,h_919/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Banana.jpeg',
  },
  {
    id: 3,
    name: 'Toothpaste',
    price: 3.0,
    qty: 8,
    image: 'https://i5.walmartimages.com/seo/Colgate-Max-Fresh-Travel-Size-Toothpaste-with-Mini-Breath-Strips-Cool-Mint-1-0-Ounce_c9939bee-e856-4af8-a035-ab3599a3892d.d767abbdd671d2756d77a5ec63e2d74b.jpeg',
  },
  {
    id: 4,
    name: 'Notebook',
    price: 5.0,
    qty: 12,
    image: 'https://m.media-amazon.com/images/I/718vM+75UNL.jpg',
  },
  {
    id: 5,
    name: 'Pen',
    price: 1.0,
    qty: 0,
    image: 'https://www.pilotpen.com.sg/wp-content/uploads/2019/10/Evolt-L.jpg',
  },
  {
    id: 6,
    name: 'Milk',
    price: 1.8,
    qty: 4,
    image: 'https://myras.com.sg/cdn/shop/products/MEIJI_Fresh_Milk_2L.jpg?v=1622560346',
  },
  {
    id: 7,
    name: 'Chips',
    price: 2.0,
    qty: 7,
    image: 'https://m.media-amazon.com/images/I/81TWeuyzk3L._SL1500_.jpg',
  },
];

function Product() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [requestedProduct, setRequestedProduct] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const handleAddToCart = async (product, quantity) => {
    if (quantity < 1) {
      setError('Please select a valid quantity.');
      return;
    }
    if (product.qty < quantity) {
      setError(`Only ${product.qty} ${product.name}(s) are available in stock!`);
      return;
    }
  
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].cartQty += quantity;
        return updatedCart;
      }
      return [...prevCart, { ...product, cartQty: quantity }];
    });
  
    setError('');
  
    // Retrieve the current user's ID (uid)
    const userId = auth.currentUser?.uid;  // Get user ID
  
    if (!userId) {
      console.error('User not authenticated');
      return;  // Stop execution if the user is not authenticated
    }
  
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      // If the document exists, update it
      await updateDoc(userRef, {
        cart: [...cart, { ...product, cartQty: quantity }],
      });
    } else {
      // If the document doesn't exist, create it
      await setDoc(userRef, {
        cart: [{ ...product, cartQty: quantity }],
      });
    }
  
    scrollToTop();
  };
  

  const handleUpdateCartItem = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, cartQty: quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleRequestProduct = async () => {
    if (!requestedProduct.trim()) {
      setRequestMessage('Please enter a product name to request.');
      return;
    }
  
    // Prepare the request data
    const requestData = {
      name: 'User',  // Replace this with actual user information (e.g., logged-in user)
      product: requestedProduct,
      quantity: 1,  // You can change this based on your need or input field
      date: new Date().toISOString(),
      status: 'unfulfilled',
    };
  
    try {
      // Add request to Firebase
      await addDoc(collection(db, 'requests'), requestData);
      setRequestMessage(`Request submitted for: ${requestedProduct}`);
      setRequestedProduct('');
      setTimeout(() => setRequestMessage(''), 3000); // Clear message after 3 seconds
      scrollToTop();  // Scroll to the top when a request is submitted
    } catch (e) {
      console.error("Error adding document: ", e);
      setRequestMessage('Failed to submit request.');
    }
    alert(`Request submitted for: ${requestedProduct}`);
    setRequestedProduct('');
    scrollToTop();
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });  // Passing cart through navigation state
  };

  const filteredProducts = productsData.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-page">
      <header className="product-header">
        <h1>Product List</h1>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </header>

      {error && <p className="error-message">{error}</p>}

      {requestMessage && <div className="request-notification">{requestMessage}</div>}

      <div className="product-container">
        <div className="product-list" style={{ padding: 50 }}>
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
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.qty}</p>
              <input
                type="number"
                min="1"
                max={product.qty}
                defaultValue="1"
                className="quantity-input"
                style={{ width: 50, marginBottom: 10 }}
                id={`quantity-${product.id}`}
              />
              <button
                onClick={() =>
                  handleAddToCart(
                    product,
                    parseInt(
                      document.getElementById(`quantity-${product.id}`).value,
                      10
                    )
                  )
                }
                disabled={product.qty < 1}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 0',
                  }}
                >
                  <div>
                    <span>{item.name}</span>
                    <input
                      type="number"
                      min="1"
                      max={item.qty}
                      value={item.cartQty}
                      onChange={(e) =>
                        handleUpdateCartItem(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      style={{ width: 50, marginLeft: 10 }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="remove-button"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>

      <div className="request-product" style={{ alignItems: 'center' }}>
        <h2 style={{ marginLeft: 10 }}>Request a Product</h2>
        <input
          type="text"
          placeholder="Enter product name..."
          value={requestedProduct}
          onChange={(e) => setRequestedProduct(e.target.value)}
          className="request-input"
          style={{ width: 500, marginLeft: 10 }}
        />
        <button onClick={handleRequestProduct} className="request-button" style={{ margin: 10 }}>
          Request Product
        </button>
      </div>
    </div>
  );
}

export default Product;
