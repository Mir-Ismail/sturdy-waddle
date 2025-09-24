import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

// Product details component for customers - fetches real product data from API

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);
        
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Handle the API response structure: { success: true, product: {...} }
        if (data.success && data.product) {
          console.log("Setting product from data.product:", data.product);
          setProduct(data.product);
        } else if (data.product) {
          // Fallback for direct product data
          console.log("Setting product from data.product (fallback):", data.product);
          setProduct(data.product);
        } else {
          // Fallback for legacy response format
          console.log("Setting product from data (legacy):", data);
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Debug: Monitor product state changes
  useEffect(() => {
    console.log("Product state updated:", product);
    if (product) {
      console.log("Product price:", product.price);
      console.log("Product name:", product.name);
      console.log("Product quantity:", product.quantity);
    }
  }, [product]);

  // Check wishlist status when user is authenticated
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !productId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/user/wishlist/check/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsWishlisted(response.data.isWishlisted);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product._id, quantity);
      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.message || "Error adding to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    try {
      setIsAddingToWishlist(true);
      const token = localStorage.getItem("token");
      
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(
          `http://localhost:5000/api/user/wishlist/${product._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(false);
        alert("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          `http://localhost:5000/api/user/wishlist`,
          {
            productId: product._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(true);
        alert("Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(error.response?.data?.message || "Error updating wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  // Inline styles object
  const styles = {
    // Container
    productDetailsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh',
      background: '#f8fafc',
    },
    
    // Header
    productHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #e2e8f0',
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      color: '#64748b',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    breadcrumb: {
      color: '#64748b',
      fontSize: '0.9rem',
    },
    
    // Loading and Error States
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center',
    },
    loadingSpinner: {
      fontSize: '1.2rem',
      color: '#64748b',
      animation: 'pulse 2s infinite',
    },
    errorContainerH2: {
      color: '#dc2626',
      marginBottom: '1rem',
    },
    errorContainerP: {
      color: '#64748b',
      marginBottom: '2rem',
    },
    btnPrimary: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    
    // Product Content
    productContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      marginBottom: '3rem',
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    
    // Product Images
    productImages: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    mainImage: {
      width: '100%',
      height: '400px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transition: 'transform 0.3s ease',
    },
    imageThumbnails: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    thumbnail: {
      width: '80px',
      height: '80px',
      border: '2px solid transparent',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'none',
      padding: 0,
    },
    thumbnailActive: {
      width: '80px',
      height: '80px',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'none',
      padding: 0,
    },
    thumbnailImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    
    // Product Info
    productInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    productTitleSection: {
      marginBottom: '1rem',
    },
    productTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
      lineHeight: 1.2,
    },
    productBrand: {
      color: '#64748b',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    stars: {
      display: 'flex',
      gap: '2px',
    },
    starFilled: {
      width: '18px',
      height: '18px',
      color: '#fbbf24',
    },
    starEmpty: {
      width: '18px',
      height: '18px',
      color: '#d1d5db',
    },
    ratingText: {
      color: '#64748b',
      fontSize: '0.9rem',
    },
    
    // Price
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },
    currentPrice: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#059669',
    },
    originalPrice: {
      fontSize: '1.2rem',
      color: '#9ca3af',
      textDecoration: 'line-through',
    },
    
    // Stock Status
    stockStatus: {
      marginBottom: '1.5rem',
    },
    stockBadge: {
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    stockBadgeInStock: {
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      background: '#dcfce7',
      color: '#166534',
    },
    stockBadgeOutOfStock: {
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      background: '#fef2f2',
      color: '#dc2626',
    },
    
    // Quantity Selector
    quantitySelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    },
    quantitySelectorLabel: {
      fontWeight: '600',
      color: '#374151',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    quantityBtn: {
      width: '40px',
      height: '40px',
      border: 'none',
      background: '#f9fafb',
      color: '#374151',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    quantityBtnDisabled: {
      width: '40px',
      height: '40px',
      border: 'none',
      background: '#f9fafb',
      color: '#9ca3af',
      fontSize: '1.2rem',
      fontWeight: '600',
      cursor: 'not-allowed',
      transition: 'all 0.3s ease',
    },
    quantityDisplay: {
      width: '60px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      fontWeight: '600',
      color: '#374151',
      borderLeft: '1px solid #d1d5db',
      borderRight: '1px solid #d1d5db',
    },
    
    // Action Buttons
    productActions: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    btnPrimaryAction: {
      flex: 1,
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      background: '#3b82f6',
      color: 'white',
    },
    btnPrimaryDisabled: {
      flex: 1,
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'not-allowed',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      background: '#9ca3af',
      color: 'white',
    },
    btnSecondary: {
      flex: 1,
      padding: '1rem 2rem',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      background: '#f3f4f6',
      color: '#374151',
    },
    wishlistBtnActive: {
      flex: 1,
      padding: '1rem 2rem',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      background: '#fecaca',
      color: '#dc2626',
    },
    
    // Product Features
    productFeatures: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.5rem',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#64748b',
      fontSize: '0.9rem',
    },
    featureIcon: {
      width: '20px',
      height: '20px',
      color: '#3b82f6',
    },
    
    // Product Tabs
    productTabs: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    tabContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    tabSection: {
      marginBottom: '2rem',
    },
    tabSectionH3: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #e2e8f0',
    },
    tabSectionP: {
      color: '#64748b',
      lineHeight: 1.6,
      marginBottom: '1rem',
    },
    
    // Specifications
    specifications: {
      display: 'grid',
      gap: '0.75rem',
    },
    specItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem',
      background: '#f8fafc',
      borderRadius: '8px',
    },
    specKey: {
      fontWeight: '600',
      color: '#374151',
    },
    specValue: {
      color: '#64748b',
    },
    
    // Vendor Info
    vendorInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    vendorInfoP: {
      margin: 0,
      color: '#64748b',
    },
    vendorInfoStrong: {
      color: '#374151',
    },
  };

  if (loading) {
    return (
      <div style={styles.productDetailsContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.productDetailsContainer}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorContainerH2}>Product Not Found</h2>
          <p style={styles.errorContainerP}>{error || "The product you are looking for does not exist."}</p>
          <button onClick={() => navigate("/")} style={styles.btnPrimary}>
            <FiArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.productDetailsContainer}>
      {/* Header */}
      <div style={styles.productHeader}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FiArrowLeft /> Back
        </button>
        <div style={styles.breadcrumb}>
          Home / Products / {product.category} / {product.name}
        </div>
      </div>

      <div style={styles.productContent}>
        {/* Product Images */}
        <div style={styles.productImages}>
          <div style={styles.mainImage}>
            <img
              src={
                product.images?.[selectedImage] || "/placeholder-product.jpg"
              }
              alt={product.name}
              style={styles.mainImageImg}
              onError={(e) => {
                e.target.src = "/placeholder-product.jpg";
              }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div style={styles.imageThumbnails}>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  style={selectedImage === index ? styles.thumbnailActive : styles.thumbnail}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={styles.thumbnailImg}
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.productInfo}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Title and Brand */}
            <div style={styles.productTitleSection}>
              <h1 style={styles.productTitle}>{product.name}</h1>
              {product.brand && (
                <p style={styles.productBrand}>Brand: {product.brand}</p>
              )}
              <div style={styles.productRating}>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} style={star <= 4 ? styles.starFilled : styles.starEmpty} />
                  ))}
                </div>
                <span style={styles.ratingText}>4.0 (128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div style={styles.productPrice}>
              <span style={styles.currentPrice}>
                PKR {product.price.toLocaleString()}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span style={styles.originalPrice}>
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <div style={styles.stockStatus}>
              <span
                style={product.quantity > 0 ? styles.stockBadgeInStock : styles.stockBadgeOutOfStock}
              >
                {product.quantity > 0
                  ? `In Stock (${product.quantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div style={styles.quantitySelector}>
                <label style={styles.quantitySelectorLabel}>Quantity:</label>
                <div style={styles.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    style={quantity <= 1 ? styles.quantityBtnDisabled : styles.quantityBtn}
                  >
                    -
                  </button>
                  <span style={styles.quantityDisplay}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    style={quantity >= product.quantity ? styles.quantityBtnDisabled : styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

                         {/* Action Buttons */}
             <div style={styles.productActions}>
               {product.quantity > 0 ? (
                 <button
                   onClick={handleAddToCart}
                   disabled={isAddingToCart}
                   style={isAddingToCart ? styles.btnPrimaryDisabled : styles.btnPrimaryAction}
                 >
                   <FiShoppingCart /> {isAddingToCart ? "Adding..." : "Add to Cart"}
                 </button>
               ) : (
                 <button disabled style={styles.btnPrimaryDisabled}>
                   <FiShoppingCart /> Out of Stock
                 </button>
               )}

               <button
                 onClick={handleAddToWishlist}
                 disabled={isAddingToWishlist}
                 style={isWishlisted ? styles.wishlistBtnActive : styles.btnSecondary}
               >
                 <FiHeart />{" "}
                 {isAddingToWishlist 
                   ? "Updating..." 
                   : isWishlisted 
                     ? "Remove from Wishlist" 
                     : "Add to Wishlist"
                 }
               </button>
             </div>

            {/* Product Features */}
            <div style={styles.productFeatures}>
              <div style={styles.feature}>
                <FiTruck style={styles.featureIcon} />
                <span>Free shipping on orders over PKR 1000</span>
              </div>
              <div style={styles.feature}>
                <FiShield style={styles.featureIcon} />
                <span>1 year warranty</span>
              </div>
              <div style={styles.feature}>
                <FiRotateCcw style={styles.featureIcon} />
                <span>30-day return policy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div style={styles.productTabs}>
        <div style={styles.tabContent}>
          <div style={styles.tabSection}>
            <h3 style={styles.tabSectionH3}>Description</h3>
            <p style={styles.tabSectionP}>{product.description}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div style={styles.tabSection}>
              <h3 style={styles.tabSectionH3}>Specifications</h3>
              <div style={styles.specifications}>
                {product.specifications.map((spec, index) => (
                  <div key={index} style={styles.specItem}>
                    <span style={styles.specKey}>{spec.key}:</span>
                    <span style={styles.specValue}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.tabSection}>
            <h3 style={styles.tabSectionH3}>Vendor Information</h3>
            <div style={styles.vendorInfo}>
              <p style={styles.vendorInfoP}>
                <strong style={styles.vendorInfoStrong}>Vendor:</strong> {product.vendor?.username || "Unknown"}
              </p>
              <p style={styles.vendorInfoP}>
                <strong style={styles.vendorInfoStrong}>Category:</strong> {product.category}
              </p>
              <p style={styles.vendorInfoP}>
                <strong style={styles.vendorInfoStrong}>Product ID:</strong> {product._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
