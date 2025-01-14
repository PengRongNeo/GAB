import React, { useState } from 'react';
import './Product.css';

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = (product) => {
    if (product.qty < 1) {
      setError(`Sorry, ${product.name} is out of stock!`);
      return;
    }
    setCart((prevCart) => [...prevCart, product]);
    setError('');
  };

  const handleRequestProduct = () => {
    if (!requestedProduct.trim()) {
      alert('Please enter a product name to request.');
      return;
    }
    alert(`Request submitted for: ${requestedProduct}`);
    setRequestedProduct(''); // Clear the input field
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

      <div className="product-container">
        <div className="product-list">
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
              <button
                onClick={() => handleAddToCart(product)}
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
              {cart.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="request-product">
        <h2>Request a Product</h2>
        <input
          type="text"
          placeholder="Enter product name..."
          value={requestedProduct}
          onChange={(e) => setRequestedProduct(e.target.value)}
          className="request-input"
        />
        <button onClick={handleRequestProduct} className="request-button">
          Request Product
        </button>
      </div>
    </div>
  );
}

export default Product;
