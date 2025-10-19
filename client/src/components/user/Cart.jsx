'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2, FiShoppingCart, FiEye, FiMinus, FiPlus, FiArrowLeft,
  FiCreditCard, FiHeart, FiStar, FiX, FiAlertCircle
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your cart");
        return;
      }
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract cart data properly from nested structure
      const cartData = res.data?.cart || res.data?.data?.cart || res.data;
      const items = cartData?.items || [];

      console.log("Cart Response:", res.data);
      console.log("Cart Items:", items);

      setCartItems(items);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleUpdateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } });
      setCartItems(prev => prev.map(i =>
        i.productId._id === id ? { ...i, quantity: newQty } : i));
      showNotification("Quantity updated");
    } catch {
      showNotification("Failed to update", "error");
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRemove = async (id) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prev => prev.filter(i => i.productId._id !== id));
      showNotification("Item removed");
    } catch {
      showNotification("Failed to remove", "error");
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const addToWishlist = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/user/wishlist", { productId: id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Added to wishlist");
    } catch {
      showNotification("Failed to add", "error");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const format = (p) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

  // 🌀 Loader
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-6 text-lg text-gray-700 font-medium">Loading your cart...</p>
    </div>
  );

  // ❌ Error
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <FiAlertCircle className="text-red-500 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart Error</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <Link to="/login"
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all">
        Go to Login
      </Link>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-16">

      {/* 🔔 Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }} className="fixed top-6 right-6 z-50">
            <div className={`px-5 py-3 rounded-xl shadow-lg flex items-center space-x-2 
              ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification({ show: false, message: '', type: '' })}>
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧭 Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm border-b z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <FiShoppingCart />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-sm text-gray-500">{cartItems.length} items</p>
              </div>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{format(total)}</p>
        </div>
      </div>

      {/* 🛒 Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-10 grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FiShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Start shopping and add products to your cart.</p>
              <Link to="/products"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:from-indigo-700 hover:to-purple-700 transition-all">
                Shop Now
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item._id || item.product?._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col sm:flex-row gap-6">

                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={item.product?.images?.[0] || '/placeholder.jpg'}
                    alt={item.product?.name || "Product"}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product?.name || "Unnamed Product"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.product?.brand || "Brand N/A"}
                    </p>
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      {[...Array(5)].map((_, idx) => (
                        <FiStar key={idx} className={idx < 4 ? "fill-current" : "text-gray-300"} />
                      ))}
                      <span className="text-sm text-gray-600">(4.5)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-indigo-600">
                        PKR {(item.product?.price || 0).toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${item.product?.quantity > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {item.product?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                        <FiMinus />
                      </button>
                      <span className="px-4 py-1 bg-white border rounded-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product?.quantity}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => addToWishlist(item.product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiHeart />
                      </button>
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      // Replace the Order Summary section in your Cart.jsx with this:

        {/* 🧾 Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-md sticky top-24 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <FiCreditCard className="text-indigo-600" /> Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span><span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                  {shipping === 0 ? "Free" : format(shipping)}
                </span>
              </div>
              <div className="border-t border-gray-100 my-3"></div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span><span className="text-indigo-600">{format(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <motion.button
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <FiCreditCard className="w-5 h-5" />
              Proceed to Checkout
            </motion.button>

            {/* Continue Shopping Link */}
            <Link to="/products"
              className="block text-center mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
