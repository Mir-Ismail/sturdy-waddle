import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiFilter,
  FiGrid,
  FiList,
} from "react-icons/fi";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Inline styles object
  const styles = {
    // Base styles
    customerProductsPage: {
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      color: '#333',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
    },
    
    // Loading and error states
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      textAlign: 'center',
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      textAlign: 'center',
      color: '#d32f2f',
    },
    loadingSpinner: {
      fontSize: '1.2rem',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    loadingSpinnerBefore: {
      content: '""',
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorContainerH2: {
      marginBottom: '10px',
    },
    tryAgainButton: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    
    // Page header
    pageHeader: {
      backgroundColor: '#f8f9fa',
      padding: '40px 0',
      marginBottom: '30px',
      borderRadius: '8px',
      textAlign: 'center',
    },
    headerContentH1: {
      fontSize: '2.5rem',
      marginBottom: '10px',
      color: '#2c3e50',
    },
    headerContentP: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
    },
    
    // Controls section
    controlsSection: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      gap: '20px',
    },
    filters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    filterGroupLabel: {
      fontWeight: '600',
      fontSize: '0.9rem',
      color: '#555',
    },
    filterSelect: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      color: 'black',
      fontSize: '0.9rem',
      minWidth: '180px',
    },
    priceInputs: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priceInput: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '4px',
      width: '80px',
      fontSize: '0.9rem',
    },
    viewControls: {
      display: 'flex',
      gap: '10px',
    },
    viewBtn: {
      background: 'none',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#555',
      transition: 'all 0.2s',
    },
    viewBtnActive: {
      background: 'none',
      border: '1px solid #3498db',
      borderRadius: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      transition: 'all 0.2s',
      backgroundColor: '#3498db',
    },
    
    // Results info
    resultsInfo: {
      marginBottom: '20px',
      fontSize: '0.9rem',
      color: '#666',
    },
    
    // Products container
    productsContainer: {
      display: 'grid',
      gap: '25px',
      marginBottom: '40px',
    },
    productsContainerGrid: {
      display: 'grid',
      gap: '25px',
      marginBottom: '40px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    productsContainerList: {
      display: 'grid',
      gap: '25px',
      marginBottom: '40px',
      gridTemplateColumns: '1fr',
    },
    
    // No results
    noResults: {
      textAlign: 'center',
      padding: '40px',
      gridColumn: '1 / -1',
    },
    noResultsH3: {
      fontSize: '1.5rem',
      marginBottom: '10px',
      color: '#555',
    },
    noResultsP: {
      color: '#888',
    },
    
    // Product card
    productCard: {
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: '1px solid #eee',
    },
    productCardList: {
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '200px',
      border: '1px solid #eee',
    },
    productCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    
    // Product link
    productLink: {
      textDecoration: 'none',
      color: 'inherit',
      width: '200px',
      height: '250px',
    },
    
    // Product image
    productImage: {
      position: 'relative',
      overflow: 'hidden',
      width: '200px',
      height: '250px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    productImageList: {
      position: 'relative',
      overflow: 'hidden',
      width: '200px',
      height: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    productImageImg: {
      width: '100%',
      alignSelf: 'center',
      padding: 0,
      height: '100%',
      objectFit: 'contain',
      transition: 'transform 0.3s',
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7f8c8d',
      fontSize: '0.9rem',
      fontWeight: '500',
      textAlign: 'center',
      border: '2px dashed #ddd',
      borderRadius: '4px',
    },
    
    // Product badges
    productBadges: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      zIndex: 2,
    },
    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
      color: 'white',
    },
    badgeSale: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#e74c3c',
    },
    badgeNew: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#2ecc71',
    },
    badgeOutOfStock: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#7f8c8d',
    },
    
    // Product info
    productInfo: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    productInfoList: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
    },
    productTitleLink: {
      textDecoration: 'none',
      color: 'inherit',
    },
    productTitle: {
      fontSize: '1.1rem',
      margin: '0 0 5px 0',
      color: '#2c3e50',
      transition: 'color 0.2s',
    },
    productTitleHover: {
      color: '#3498db',
    },
    productBrand: {
      fontSize: '0.85rem',
      color: '#7f8c8d',
      margin: '0 0 10px 0',
    },
    
    // Product rating
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginBottom: '10px',
    },
    stars: {
      display: 'flex',
      gap: '2px',
    },
    starFilled: {
      color: '#f39c12',
      fill: '#f39c12',
    },
    ratingText: {
      fontSize: '0.8rem',
      color: '#7f8c8d',
    },
    
    // Product price
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '10px 0',
      flexWrap: 'wrap',
    },
    currentPrice: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#2c3e50',
    },
    originalPrice: {
      fontSize: '0.9rem',
      color: '#95a5a6',
      textDecoration: 'line-through',
    },
    discountBadge: {
      fontSize: '0.8rem',
      backgroundColor: '#e74c3c',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '4px',
      fontWeight: '600',
    },
    
    // Product stock
    productStock: {
      margin: '5px 0 15px 0',
    },
    stockBadge: {
      fontSize: '0.8rem',
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: '600',
    },
    stockBadgeInStock: {
      fontSize: '0.8rem',
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: '600',
      backgroundColor: '#e8f8f5',
      color: '#27ae60',
    },
    stockBadgeOutOfStock: {
      fontSize: '0.8rem',
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: '600',
      backgroundColor: '#fdedec',
      color: '#e74c3c',
    },
    
    // Product actions
    productActions: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto',
      marginBottom: 0,
    },
    btnPrimary: {
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      backgroundColor: '#3498db',
      color: 'white',
      flexGrow: 1,
      justifyContent: 'center',
    },
    btnPrimaryDisabled: {
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      backgroundColor: '#bdc3c7',
      color: '#7f8c8d',
      flexGrow: 1,
      justifyContent: 'center',
    },
    btnSecondary: {
      border: '1px solid #ddd',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      backgroundColor: 'white',
      color: '#7f8c8d',
      width: '40px',
      justifyContent: 'center',
    },
  };

  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle both possible response structures
        const productsData = data.products || data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  // Extract q from URL
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "newest":
      default:
        return sorted.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
  };

  const filterProductsByPrice = (products, min, max) => {
    return products.filter((product) => {
      const price = product.price || 0;
      const minPrice = min ? parseInt(min) : 0;
      const maxPrice = max ? parseInt(max) : Infinity;
      return price >= minPrice && price <= maxPrice;
    });
  };

  const filterProductsByCategory = (products, category) => {
    if (category === "all") return products;
    return products.filter(
      (product) => (product.category || "").toLowerCase() === category.toLowerCase()
    );
  };

  const filteredAndSortedProducts = sortProducts(
    filterProductsByPrice(
      filterProductsByCategory(
        products.filter((p) => {
          if (!q) return true;
          const hay = `${p.name || ''} ${p.description || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
          return hay.includes(q);
        }),
        selectedCategory
      ),
      priceRange.min,
      priceRange.max
    ),
    sortBy
  );

  const categories = [
    "all",
    "mobile phones",
    "laptops",
    "audio & video",
    "computer accessories",
    "cameras",
    "home appliances",
  ];

  // Helper function to safely get product image
  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  // Helper function to check if product is new (within 7 days)
  const isProductNew = (product) => {
    if (!product.createdAt) return false;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(product.createdAt) > sevenDaysAgo;
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (product) => {
    if (!product.originalPrice || !product.price || product.originalPrice <= product.price) {
      return 0;
    }
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  if (loading) {
    return (
      <div style={styles.customerProductsPage}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>
            <div style={styles.loadingSpinnerBefore}></div>
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.customerProductsPage}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorContainerH2}>Error Loading Products</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.tryAgainButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.customerProductsPage}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.headerContentH1}>All Products</h1>
          <p style={styles.headerContentP}>
            {q ? `Search results for "${q}"` : 'Discover amazing products from our trusted vendors'}
          </p>
        </div>
      </div>

      <div>
        {/* Filters and Controls */}
        <div style={styles.controlsSection}>
          <div style={styles.filters}>
            <div style={styles.filterGroup}>
              <label style={styles.filterGroupLabel}>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.filterSelect}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterGroupLabel}>Price Range:</label>
              <div style={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  style={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  style={styles.priceInput}
                />
              </div>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterGroupLabel}>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          <div style={styles.viewControls}>
            <button
              style={viewMode === "grid" ? styles.viewBtnActive : styles.viewBtn}
              onClick={() => setViewMode("grid")}
            >
              <FiGrid />
            </button>
            <button
              style={viewMode === "list" ? styles.viewBtnActive : styles.viewBtn}
              onClick={() => setViewMode("list")}
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div style={styles.resultsInfo}>
          <p>
            Showing {filteredAndSortedProducts.length} of {products.length}{" "}
            products
            {products.length === 0 && (
              <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                {" "}- No products available in the database
              </span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        <div style={viewMode === "grid" ? styles.productsContainerGrid : styles.productsContainerList}>
          {filteredAndSortedProducts.length === 0 ? (
            <div style={styles.noResults}>
              <h3 style={styles.noResultsH3}>No products found</h3>
              <p style={styles.noResultsP}>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredAndSortedProducts.map((product) => (
              <motion.div
                key={product._id}
                style={viewMode === "list" ? styles.productCardList : styles.productCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Link to={`/product/${product._id}`} style={styles.productLink}>
                  <div style={viewMode === "list" ? styles.productImageList : styles.productImage}>
                    {/* Product Badges */}
                    <div style={styles.productBadges}>
                      {(product.quantity || 0) === 0 && (
                        <span style={styles.badgeOutOfStock}>Out of Stock</span>
                      )}
                      {getDiscountPercentage(product) > 0 && (
                        <span style={styles.badgeSale}>Sale</span>
                      )}
                      {isProductNew(product) && (
                        <span style={styles.badgeNew}>New</span>
                      )}
                    </div>

                    {/* Product Image */}
                    {getProductImage(product) ? (
                      <img
                        src={getProductImage(product)}
                        alt={product.name || "Product"}
                        style={styles.productImageImg}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>No Image</div>
                    )}
                  </div>
                </Link>

                <div style={viewMode === "list" ? styles.productInfoList : styles.productInfo}>
                  <Link
                    to={`/product/${product._id}`}
                    style={styles.productTitleLink}
                  >
                    <h3 style={styles.productTitle}>{product.name || "Unnamed Product"}</h3>
                  </Link>

                  {product.brand && (
                    <p style={styles.productBrand}>{product.brand}</p>
                  )}

                  <div style={styles.productRating}>
                    <div style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          style={star <= 4 ? styles.starFilled : {}}
                        />
                      ))}
                    </div>
                    <span style={styles.ratingText}>4.0 (128 reviews)</span>
                  </div>

                  <div style={styles.productPrice}>
                    <span style={styles.currentPrice}>
                      PKR {(product.price || 0).toLocaleString()}
                    </span>
                    {getDiscountPercentage(product) > 0 && (
                      <>
                        <span style={styles.originalPrice}>
                          PKR {(product.originalPrice || 0).toLocaleString()}
                        </span>
                        <span style={styles.discountBadge}>
                          -{getDiscountPercentage(product)}%
                        </span>
                      </>
                    )}
                  </div>

                  <div style={styles.productStock}>
                    <span
                      style={(product.quantity || 0) > 0 ? styles.stockBadgeInStock : styles.stockBadgeOutOfStock}
                    >
                      {(product.quantity || 0) > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div style={styles.productActions}>
                    <button 
                      style={(product.quantity || 0) === 0 ? styles.btnPrimaryDisabled : styles.btnPrimary}
                      disabled={(product.quantity || 0) === 0}
                    >
                      <FiShoppingCart /> 
                      {(product.quantity || 0) === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button style={styles.btnSecondary}>
                      <FiHeart />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
