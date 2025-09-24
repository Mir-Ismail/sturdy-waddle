import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiClock,
  FiPercent,
} from "react-icons/fi";
import "./TodayDeals.css";

const TodayDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/products/deals"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch deals");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="today-deals-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading today's deals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-deals-page">
        <div className="error-container">
          <h2>Error Loading Deals</h2>
          <p>{error}</p>
          <Link to="/products" className="btn">Browse All Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="today-deals-page">
      {/* Header */}
      <div className="deals-header">
        <div className="header-content">
          <div className="header-icon">
            <FiPercent />
          </div>
          <div className="header-text">
            <h1>Today's Deals</h1>
            <p>Limited time offers - Don't miss out on these amazing deals!</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-timer">
          <div className="timer-label">Deals end in:</div>
          <div className="timer-display">
            <div className="time-unit">
              <span className="time-value">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="time-label">Hours</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-value">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="time-label">Minutes</span>
            </div>
            <div className="time-separator">:</div>
            <div className="time-unit">
              <span className="time-value">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="deals-content">
        {products.length === 0 ? (
          <div className="no-deals">
            <h3>No deals available today</h3>
            <p>Check back tomorrow for new deals!</p>
            <Link to="/products" className="btn">Browse All Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => {
              const discount = calculateDiscount(
                product.originalPrice || product.price,
                product.price
              );

              return (
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
                      <div className="discount-badge">-{discount}%</div>
                      <div className="deal-badge">
                        <FiClock />
                        <span>DEAL</span>
                      </div>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Want more deals?</h2>
          <p>
            Sign up for our newsletter to get notified about exclusive offers
          </p>
          <div className="newsletter-signup">
            <input
              type="email"
              placeholder="Enter your email address"
              className="email-input"
            />
            <button className="btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayDeals;
