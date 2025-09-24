import React, { useState, useEffect } from "react";
import { FiHeart, FiTrash2, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      // Remove from local state
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      alert("Added to cart successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="wishlist">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <FiHeart size={48} />
          <p>No items in wishlist yet</p>
          <p>Products you wishlist will appear here</p>
          <Link to="/products" className="btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-card">
              <div className="wishlist-image">
                {item.productId.images && item.productId.images[0] ? (
                  <img
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <div className="wishlist-overlay">
                  <button
                    className="remove-wishlist"
                    onClick={() => removeFromWishlist(item.productId._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="wishlist-details">
                <h3>{item.productId.name}</h3>
                <p className="description">{item.productId.description}</p>
                <div className="price-section">
                  <span className="price">PKR {item.productId.price}</span>
                  <span className="stock">
                    In Stock: {item.productId.quantity}
                  </span>
                </div>

                <div className="wishlist-actions">
                  <button
                    className="btn"
                    onClick={() => addToCart(item.productId._id)}
                    disabled={item.productId.quantity === 0}
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                  <Link
                    to={`/product/${item.productId._id}`}
                    className="btn-secondary"
                  >
                    <FiEye /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
