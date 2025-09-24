import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiShoppingCart, FiHeart, FiClock } from "react-icons/fi";
import "./NewArrivals.css";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/products/new-arrivals"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="new-arrivals-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading new arrivals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="new-arrivals-page">
        <div className="error-container">
          <h2>Error Loading New Arrivals</h2>
          <p>{error}</p>
          <Link to="/products" className="btn">Browse All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="new-arrivals-page">
      {/* Header */}
      <div className="new-arrivals-header">
        <div className="header-content">
          <div className="header-icon">
            <FiClock />
          </div>
          <div className="header-text">
            <h1>New Arrivals</h1>
            <p>Discover the latest products added to our collection</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="new-arrivals-content">
        {products.length === 0 ? (
          <div className="no-products">
            <h3>No new arrivals yet</h3>
            <p>Check back soon for the latest products!</p>
            <Link to="/products" className="btn">Browse All Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/product/${product._id}`} className="product-link">
                  <div className="product-image">
                    <img
                      src={product.images?.[0] || "/placeholder-product.jpg"}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                    <div className="product-overlay">
                      <span>View Details</span>
                    </div>
                    <div className="new-badge">NEW</div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    {product.brand && (
                      <p className="product-brand">{product.brand}</p>
                    )}

                    <div className="product-rating">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={star <= 4 ? "filled" : ""}
                          />
                        ))}
                      </div>
                      <span>(4.0)</span>
                    </div>

                    <div className="product-price">
                      <span className="current-price">
                        PKR {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="original-price">
                            PKR {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                    </div>

                    <div className="product-stock">
                      <span
                        className={`stock-badge ${
                          product.quantity > 0 ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="product-actions">
                  <button className="btn add-to-cart">
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <button className="btn-secondary wishlist">
                    <FiHeart />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Can't find what you're looking for?</h2>
          <p>Browse our complete collection of products</p>
          <Link to="/products" className="btn">Browse All Products</Link>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
