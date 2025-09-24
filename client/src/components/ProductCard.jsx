import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiEye, FiBarChart2 } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    // Placeholder for add to cart functionality
    alert("Add to cart functionality will be implemented here");
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/compare', { state: { productToCompare: product } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          style={{
            width: "16px",
            height: "16px",
            color: "#fbbf24",
            fill: "currentColor",
          }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          style={{
            width: "16px",
            height: "16px",
            color: "#fbbf24",
            fill: "currentColor",
            opacity: 0.7,
          }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          style={{ width: "16px", height: "16px", color: "#e2e8f0" }}
        />
      );
    }

    return stars;
  };

  // Inline styles object
  const styles = {
    productCard: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    productCardHover: {
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    productLink: {
      textDecoration: "none",
      color: "inherit",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    productImageContainer: {
      position: "relative",
      width: "100%",
      height: "320px",
      overflow: "hidden",
      background: "#f8fafc",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    productImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      transition: "transform 0.3s ease",
      maxWidth: "100%",
      maxHeight: "100%",
      padding: "1rem",
    },
    productImageHover: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      transition: "transform 0.3s ease",
      maxWidth: "100%",
      maxHeight: "100%",
      padding: "1rem",
      transform: "scale(1.05)",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: isHovered ? 1 : 0,
      transition: "opacity 0.3s ease",
    },
    overlayActions: {
      display: "flex",
      gap: "0.5rem",
      transform: isHovered ? "translateY(0)" : "translateY(20px)",
      transition: "transform 0.3s ease",
    },
    overlayBtn: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "none",
      background: "white",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
    overlayBtnHover: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "none",
      background: "#3498db",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      transform: "scale(1.1)",
    },
    overlayBtnWishlist: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "none",
      background: isWishlisted ? "#e74c3c" : "white",
      color: isWishlisted ? "white" : "#64748b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    },
    statusBadge: {
      position: "absolute",
      top: "12px",
      left: "12px",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      zIndex: 10,
      background: "#ef4444",
      color: "white",
    },
    statusBadgeNew: {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      zIndex: 10,
      background: "#10b981",
      color: "white",
    },
    productInfo: {
      padding: "1.5rem",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
    },
    productCategory: {
      fontSize: "0.8rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "0.5rem",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    productName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#1e293b",
      margin: "0 0 0.5rem 0",
      lineHeight: 1.4,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    productBrand: {
      fontSize: "0.9rem",
      color: "#64748b",
      marginBottom: "0.75rem",
      fontWeight: "500",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    productRating: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.75rem",
      flexWrap: "wrap",
    },
    stars: {
      display: "flex",
      gap: "2px",
      flexShrink: 0,
    },
    ratingText: {
      fontSize: "0.8rem",
      color: "#64748b",
      flexShrink: 0,
    },
    productPrice: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.75rem",
      flexWrap: "wrap",
    },
    currentPrice: {
      fontSize: "1.2rem",
      fontWeight: "700",
      color: "#3498db",
      flexShrink: 0,
    },
    originalPrice: {
      fontSize: "0.9rem",
      color: "#94a3b8",
      textDecoration: "line-through",
      flexShrink: 0,
    },
    stockStatus: {
      fontSize: "0.8rem",
      marginTop: "auto",
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
    inStock: {
      color: "#10b981",
      fontWeight: "500",
    },
    outOfStock: {
      color: "#ef4444",
      fontWeight: "500",
    },
  };

  return (
    <motion.div
      style={isHovered ? styles.productCardHover : styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product._id}`} style={styles.productLink}>
        {/* Product Image */}
        <div style={styles.productImageContainer}>
          <img
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            style={isHovered ? styles.productImageHover : styles.productImage}
            onError={(e) => {
              e.target.src = "/placeholder-product.jpg";
            }}
          />

          {/* Image Overlay */}
          <motion.div
            style={styles.imageOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={styles.overlayActions}>
              <button
                style={styles.overlayBtnWishlist}
                onClick={handleWishlist}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FiHeart style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                style={styles.overlayBtn}
                onClick={handleAddToCart}
                title="Add to cart"
                onMouseEnter={(e) => {
                  e.target.style.background = "#3498db";
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#64748b";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <FiShoppingCart style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                style={styles.overlayBtn}
                onClick={handleCompare}
                title="Compare"
                onMouseEnter={(e) => {
                  e.target.style.background = "#3498db";
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#64748b";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <FiBarChart2 style={{ width: "20px", height: "20px" }} />
              </button>
              <button
                style={styles.overlayBtn}
                title="Quick view"
                onMouseEnter={(e) => {
                  e.target.style.background = "#3498db";
                  e.target.style.color = "white";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#64748b";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <FiEye style={{ width: "20px", height: "20px" }} />
              </button>
            </div>
          </motion.div>

          {/* Status Badges */}
          {product.status === "revoked" && (
            <div style={styles.statusBadge}>Unavailable</div>
          )}

          {new Date(product.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div style={styles.statusBadgeNew}>New</div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.productInfo}>
          {/* Category */}
          {product.category && (
            <div style={styles.productCategory}>{product.category}</div>
          )}

          {/* Product Name */}
          <h3 style={styles.productName}>{product.name}</h3>

          {/* Brand */}
          {product.brand && (
            <div style={styles.productBrand}>{product.brand}</div>
          )}

          {/* Rating */}
          <div style={styles.productRating}>
            <div style={styles.stars}>{getRatingStars()}</div>
            <span style={styles.ratingText}>(4.5)</span>
          </div>

          {/* Price */}
          <div style={styles.productPrice}>
            <span style={styles.currentPrice}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div style={styles.stockStatus}>
            {product.quantity > 0 ? (
              <span style={styles.inStock}>{product.quantity} available</span>
            ) : (
              <span style={styles.outOfStock}>Out of stock</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
