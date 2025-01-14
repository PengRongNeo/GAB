import React, { useState } from 'react';
import './Product.css';

const initialProductsData = [
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
];

function AdminProductPage() {
  const [products, setProducts] = useState(initialProductsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    qty: '',
    image: '',
  });
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    const { name, price, qty, image } = newProduct;

    if (!name || !price || !qty || !image) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(price) || isNaN(qty)) {
      setError('Price and Quantity must be numeric values.');
      return;
    }

    const newProductEntry = {
      id: products.length + 1,
      name,
      price: parseFloat(price),
      qty: parseInt(qty, 10),
      image,
    };

    setProducts([...products, newProductEntry]);
    setNewProduct({ name: '', price: '', qty: '', image: '' });
    setError('');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-page">
      <header className="product-header">
        <h1>Admin Product Management</h1>
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
          <h2>Product List</h2>
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
            </div>
          ))}
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
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="qty"
              placeholder="Quantity"
              value={newProduct.qty}
              onChange={handleInputChange}
              className="form-input"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={handleInputChange}
              className="form-input"
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
