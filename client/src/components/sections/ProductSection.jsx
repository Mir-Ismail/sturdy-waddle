import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FiArrowRight,
  FiChevronRight,
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiBarChart2,
  FiStar
} from "react-icons/fi";

const ProductSection = ({
  title,
  subtitle,
  products,
  emptyMessage = "No products found in this category",
  emptyIcon = "📦",
  showViewAll,
  viewAllLink,
  sectionIcon,
  sectionColor = "from-blue-500 to-purple-500",
  loading = false
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
        ease: "easeOut"
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  // Loading state - more compact
  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mb-1"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Empty state - more compact
  if (!products || products.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {sectionIcon && (
              <div className={`w-8 h-8 bg-gradient-to-r ${sectionColor} rounded-lg flex items-center justify-center`}>
                {sectionIcon}
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
        </div>

        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-4">{emptyIcon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 text-sm mb-6">Check back soon for new products</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Browse All Products</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  // Show 6 products for better grid layout
  const displayedProducts = products.slice(0, 6);
  const hasMoreProducts = products.length > 6;

  return (
    <motion.section
      className="py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Compact Section Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div className="flex items-center space-x-3" variants={itemVariants}>
          {sectionIcon && (
            <div className={`w-8 h-8 bg-gradient-to-r ${sectionColor} rounded-lg flex items-center justify-center shadow-sm`}>
              {sectionIcon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
            )}
          </div>
        </motion.div>

        {/* View All Link */}
        {(showViewAll || hasMoreProducts) && (
          <motion.div variants={itemVariants}>
            <Link
              to={viewAllLink}
              className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 group"
            >
              <span>View All</span>
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Compact Products Grid - 6 columns on desktop */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
      >
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product._id || product.id || index}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="group"
          >
            <EnhancedCompactProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Show more products indicator */}
      {hasMoreProducts && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to={viewAllLink}
            className="inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
          >
            <span>View All {products.length} Products</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};

// Enhanced Compact Product Card with all ProductCard functionality
const EnhancedCompactProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  // Format price like in ProductCard
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get rating stars like in ProductCard
  const getRatingStars = (rating = product.rating || 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          className="w-3 h-3 text-yellow-400 fill-current"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          className="w-3 h-3 text-yellow-400 fill-current opacity-70"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          className="w-3 h-3 text-gray-300"
        />
      );
    }

    return stars;
  };

  // Check if product is new (within 7 days)
  const isNewProduct = () => {
    if (!product.createdAt) return false;
    return new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  };

  // Action handlers from ProductCard
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Add to cart functionality will be implemented here");
    // Add your cart logic here
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", product.name);
    // Add your wishlist logic here
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Quick view:", product.name);
    // Add your quick view modal logic here
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/compare', { state: { productToCompare: product } });
  };

  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden relative">

        {/* Product Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden relative">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-2xl">📦</div>
            </div>
          )}

          {/* Status Badges */}
          {product.status === "revoked" && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
              Unavailable
            </div>
          )}

          {isNewProduct() && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-md">
              New
            </div>
          )}

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Hover Actions Overlay */}
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-1 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            <button
              onClick={handleWishlist}
              className={`p-1.5 rounded-full transition-all duration-200 transform hover:scale-110 text-xs ${isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'
                }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart className="w-3 h-3" />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-110 text-xs"
              title="Add to Cart"
            >
              <FiShoppingCart className="w-3 h-3" />
            </button>
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-900 p-1.5 rounded-full hover:bg-green-500 hover:text-white transition-all duration-200 transform hover:scale-110 text-xs"
              title="Quick View"
            >
              <FiEye className="w-3 h-3" />
            </button>
            <button
              onClick={handleCompare}
              className="bg-white text-gray-900 p-1.5 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-200 transform hover:scale-110 text-xs"
              title="Compare"
            >
              <FiBarChart2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
          )}

          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2 font-medium">{product.brand}</p>
          )}

          {/* Rating */}
          {(product.rating || product.rating === 0) && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {getRatingStars()}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-semibold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-xs">
            {product.quantity > 0 ? (
              <span className="text-green-600 font-medium">{product.quantity} available</span>
            ) : (
              <span className="text-red-500 font-medium">Out of stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// PropTypes validation
ProductSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  products: PropTypes.array,
  emptyMessage: PropTypes.string,
  emptyIcon: PropTypes.string,
  showViewAll: PropTypes.bool,
  viewAllLink: PropTypes.string,
  sectionIcon: PropTypes.element,
  sectionColor: PropTypes.string,
  loading: PropTypes.bool,
};

EnhancedCompactProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductSection;