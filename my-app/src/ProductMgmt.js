import React, { useState } from 'react';
import './ProductMgmt.css';

const initialProductsData = [
  {
    id: 1,
    name: 'Lays Potato Chips Classic',
    price: 5.35,
    qty: 10,
    image: 'https://ip.prod.freshop.retail.ncrcloud.com/resize?url=https://images.freshop.ncrcloud.com/00028400090858/27c61e6d7a4ca44cec9d94f8914ce3b6_large.png&width=512&type=webp&quality=90',
  },
  {
    id: 2,
    name: 'Lays Potato Chips Sour Cream and Onion',
    price: 5.35,
    qty: 3,
    image: 'https://media.nedigital.sg/fairprice/fpol/media/images/product/XL/13253763_XL1_20240902.jpg',
  },
  {
    id: 3,
    name: 'Lays Potato Chips Nori Seaweed',
    price: 5.35,
    qty: 8,
    image: 'https://media.nedigital.sg/fairprice/fpol/media/images/product/XL/13232157_XL1_20230427.jpg',
  },
  {
    id: 4,
    name: 'Melona Melon Ice Cream',
    price: 2.0,
    qty: 12,
    image: 'https://wimg.heraldcorp.com/content/default/2023/08/16/20230816000600_0.jpg',
  },
  {
    id: 5,
    name: 'Melona Strawberry Ice Cream',
    price: 2.0,
    qty: 0,
    image: 'https://down-sg.img.susercontent.com/file/7b09e12af0656ff575fbe7076dd10ee8',
  },
  {
    id: 6,
    name: 'Cornetto Classic Ice Cream',
    price: 2.0,
    qty: 0,
    image: 'https://www.creedfoodservice.co.uk/media/catalog/product/cache/935f6cdd49b787f7edd26d0d606f282f/a/d/adda3e386cefc7e298991d3af5a2f047.jpg',
  },
  {
    id: 7,
    name: 'Cornetto Double Chocolate Ice Cream',
    price: 2.0,
    qty: 0,
    image: 'https://springs.com.pk/cdn/shop/files/8961014014228.jpg?v=1714394949',
  },
  {
    id: 8,
    name: 'Soccer Ball',
    price: 20.0,
    qty: 1,
    image: 'https://i0.wp.com/championsports.com.sg/wp-content/uploads/2024/07/Adidas-Euro-24-Final-League-Soccer-Ball-IX4046-1.jpg?fit=800%2C800&ssl=1',
  },
  {
    id: 9,
    name: 'BasketBall',
    price: 20.0,
    qty: 1,
    image: 'https://contents.mediadecathlon.com/p2480634/k$170e3f4f626da03c4c58201e6f014ea7/size-7-basketball-bt100-for-men-ages-13-and-up-orange-tarmak-8648076.jpg',
  },
];

function AdminProductPage() {
  const [products, setProducts] = useState(initialProductsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(initialProductsData);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    qty: '',
    image: '',
  });
  const [error, setError] = useState('');

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

    const updatedProducts = [...products, newProductEntry];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts); // Update filtered list too
    setNewProduct({ name: '', price: '', qty: '', image: '' });
    setError('');
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

      {error && <p className="error-message">{error}</p>}

      <div className="product-container">
        <div>
          <h2>Product List</h2>
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
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Quantity: {product.qty}</p>
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
