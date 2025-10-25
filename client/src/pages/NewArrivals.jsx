import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiClock,
  FiEye,
  FiBarChart2,
} from "react-icons/fi";
import useWishlist from "../hooks/useWishlist";
import axios from "axios";

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

  if (loading)
    return <LoadingSpinner fullScreen text="Loading new arrivals..." />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Error Loading New Arrivals
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-16 px-6 text-center mb-12">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white/20 p-5 rounded-full text-4xl">
            <FiClock />
          </div>
          <h1 className="text-4xl font-extrabold">New Arrivals</h1>
          <p className="text-indigo-100 text-lg max-w-lg mx-auto">
            Discover the latest products added to our collection
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="bg-white text-center p-10 rounded-2xl shadow">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No new arrivals yet
            </h3>
            <p className="text-gray-500 mb-6">
              Check back soon for the latest products!
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
              >
                <NewArrivalsProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-2xl py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Can’t find what you’re looking for?
        </h2>
        <p className="text-white/90 mb-8">
          Browse our complete collection of products
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transition-all"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
};

// New Arrivals Product Card Component
const NewArrivalsProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist(false);
  const navigate = useNavigate();

  // Format price
  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  // Action handlers
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleAddToWishlist = (e) => toggleWishlist(e, product._id);

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Quick view:", product.name);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/compare", { state: { productToCompare: product } });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="text-4xl text-gray-400">📦</div>
            </div>
          )}

          {/* Status Badge - New */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow-sm">
            NEW
          </div>

          {/* Hover Actions Overlay - Only covers the image area */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110"
                title="Add to Cart"
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-900 hover:bg-red-500 hover:text-white"
                }`}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FiHeart className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuickView}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                title="Quick View"
              >
                <FiEye className="w-4 h-4" />
              </button>
              <button
                onClick={handleCompare}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                title="Compare"
              >
                <FiBarChart2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-base leading-tight">
            {product.name}
          </h3>

          {/* Brand */}
          {product.brand && (
            <p className="text-sm text-gray-600 font-medium">{product.brand}</p>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`w-4 h-4 ${
                      star <= 4
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">(4.0)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-xs">
            {product.quantity > 0 ? (
              <span className="text-green-600 font-medium">
                {product.quantity} available
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

NewArrivalsProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.string,
    brand: PropTypes.string,
    status: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }).isRequired,
};

export default NewArrivals;
