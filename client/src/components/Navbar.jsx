import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiPhone,
  FiTruck,
  FiPackage,
  FiGrid,
} from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showCategories, setShowCategories] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = viewportWidth < 768;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const getUserID = () => {
    if (!user) return null;
    return user._id || null;
  };

  // Helper function to check if user has specific role
  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    return Array.isArray(roles)
      ? roles.includes(user.role)
      : user.role === roles;
  };

  // Check if user is a customer (buyer)
  const isCustomer = () => {
    return hasRole("buyer") || !user?.role;
  };

  // Check if user is a vendor or admin
  const isVendorOrAdmin = () => {
    return hasRole("vendor") || hasRole("admin");
  };

  // Product categories for dropdown
  const categories = [
    "Air conditioner",
    "Kitchen appliances",
    "PCs & laptop",
    "Gadgets",
    "Smart home",
    "Audio & video",
    "Refrigerator",
    "Home appliances",
  ];

  const navigation = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Compare",
      href: "/compare",
    },
    ...(!isAuthenticated ? [{ name: "Login", href: "/login" }] : []),
    ...(isAuthenticated
      ? [
          // Dashboard - Vendors and Admins only
          ...(isVendorOrAdmin()
            ? [
                {
                  name: "Dashboard",
                  href: "/dashboard",
                },
              ]
            : []),

          // New Arrivals - All authenticated users
          {
            name: "New Arrivals",
            href: "/new-arrivals",
          },
        ]
      : []),
  ];

  // Inline styles object
  const styles = {
    // Top Bar
    topBar: {
      background: '#2c3e50',
      color: 'white',
      padding: '8px 0',
      fontSize: '0.85rem',
    },
    topBarContainer: {
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    topBarLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    customerService: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    topBarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    topBarLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'white',
      textDecoration: 'none',
      transition: 'opacity 0.3s ease',
    },
    icon: {
      fontSize: '0.9rem',
    },
    
    // Main Header
    mainHeader: {
      background: '#3498db',
      color: 'white',
      padding: '1rem 0',
    },
    headerContainer: {
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
    },
    
    // Logo
    logo: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '700',
    },
    logoText: {
      color: 'white',
    },
    logoAccent: {
      color: '#f39c12',
      position: 'relative',
    },
    
    // Search Container
    searchContainer: {
      flex: 1,
      maxWidth: '500px',
    },
    searchBar: {
      display: 'flex',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    searchInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: 'none',
      outline: 'none',
      fontSize: '0.95rem',
    },
    searchBtn: {
      background: '#2980b9',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.25rem',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // User Actions
    userActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    actionItem: {
      position: 'relative',
    },
    actionBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1.2rem',
      padding: '0.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
    },
    
    // Badges
    cartBadge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#e74c3c',
      color: 'white',
      fontSize: '0.7rem',
      padding: '2px 6px',
      borderRadius: '50%',
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    notificationBadge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      background: '#e74c3c',
      color: 'white',
      fontSize: '0.7rem',
      padding: '2px 6px',
      borderRadius: '50%',
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    
    // Profile Button
    profileBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    profileImage: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    profilePlaceholder: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1rem',
    },
    profileName: {
      color: 'white',
      fontWeight: '500',
      fontSize: '0.9rem',
      maxWidth: '120px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    // Login Button
    loginBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      textDecoration: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    
    // Navigation Bar
    navBar: {
      background: '#2980b9',
      color: 'white',
      padding: '0.75rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    navContainer: {
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    
    // Categories Dropdown
    categoriesDropdown: {
      position: 'relative',
    },
    dropdownBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      transition: 'background 0.3s ease',
    },
    chevron: {
      fontSize: '0.8rem',
      transition: 'transform 0.3s ease',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      background: '#2980b9',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      minWidth: '200px',
      zIndex: 1000,
      marginTop: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    dropdownItem: {
      display: 'block',
      padding: '0.75rem 1rem',
      color: 'white',
      textDecoration: 'none',
      transition: 'background 0.3s ease',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    dropdownDivider: {
      height: '1px',
      background: 'rgba(255, 255, 255, 0.2)',
      margin: '0.5rem 0',
    },
    
    // Navigation Links
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
    },
    
    // Mobile Menu Toggle
    mobileMenuToggle: {
      display: 'none',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '6px',
      transition: 'background 0.3s ease',
    },
    
    // Mobile Menu
    mobileMenu: {
      display: isOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 2000,
    },
    mobileMenuContent: {
      background: '#2980b9',
      height: '100%',
      width: '300px',
      padding: '2rem',
      overflowY: 'auto',
    },
    mobileMenuItem: {
      display: 'block',
      color: 'white',
      textDecoration: 'none',
      padding: '1rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      fontWeight: '500',
    },
    mobileCategories: {
      marginTop: '2rem',
    },
    mobileCategoryItem: {
      display: 'block',
      color: 'white',
      textDecoration: 'none',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '0.95rem',
    },
  };

  return (
    <>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarContainer}>
          <div style={styles.topBarLeft}>
            <span style={styles.customerService}>
              <FiPhone style={styles.icon} />
              24/7 Customer service 1-800-234-5678
            </span>
          </div>
          <div style={styles.topBarRight}>
            {/* Removed shipping and track order links as they don't have routes */}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header style={styles.mainHeader}>
        <div style={styles.headerContainer}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoText}>Market</span>
            <span style={styles.logoAccent}>Match</span>
          </Link>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Search product..."
                style={styles.searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = query.trim();
                    if (q.length > 0) navigate(`/products?q=${encodeURIComponent(q)}`);
                  }
                }}
              />
              <button
                style={styles.searchBtn}
                onClick={() => {
                  const q = query.trim();
                  if (q.length > 0) navigate(`/products?q=${encodeURIComponent(q)}`);
                }}
                aria-label="Search"
              >
                <FiSearch />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div style={styles.userActions}>
            {isAuthenticated ? (
              <>
                {/* For regular users (customers) - show cart, wishlist, and profile */}
                {isCustomer() && (
                  <>
                    {/* Cart */}
                    <div style={styles.actionItem}>
                      <Link to="/cart" style={styles.actionBtn}>
                        <FiShoppingCart />
                        {cartCount > 0 && (
                          <span style={styles.cartBadge}>{cartCount}</span>
                        )}
                      </Link>
                    </div>

                    {/* Wishlist */}
                    <div style={styles.actionItem}>
                      <Link to="/wishlist" style={styles.actionBtn}>
                        <FiHeart />
                      </Link>
                    </div>
                  </>
                )}

                {/* For vendors and admins - show notifications and dashboard access */}
                {isVendorOrAdmin() && (
                  <>
                    {/* Notifications */}
                    <div style={styles.actionItem}>
                      <button style={styles.actionBtn}>
                        <FiBell />
                        <span style={styles.notificationBadge}>3</span>
                      </button>
                    </div>

                    {/* Dashboard Link */}
                    <div style={styles.actionItem}>
                      <Link
                        to="/dashboard"
                        style={styles.actionBtn}
                        title="Dashboard"
                      >
                        <FiGrid />
                      </Link>
                    </div>
                  </>
                )}

                {/* User Profile - All authenticated users */}
                <div style={styles.actionItem}>
                  <ProfileModal>
                    <div style={styles.profileBtn}>
                      {user?.pic ? (
                        <img
                          src={user.pic}
                          alt={user.name}
                          style={styles.profileImage}
                        />
                      ) : (
                        <div style={styles.profilePlaceholder}>
                          <FiUser />
                        </div>
                      )}
                      <span style={styles.profileName}>
                        {user?.name || user?.email}
                      </span>
                    </div>
                  </ProfileModal>
                </div>
              </>
            ) : (
              <Link to="/login" style={styles.loginBtn}>
                Log In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav style={styles.navBar}>
        <div style={styles.navContainer}>
          <div style={styles.navLeft}>
            {/* Categories Dropdown */}
            {!isMobile && (
            <div style={styles.categoriesDropdown}>
              <button
                style={styles.dropdownBtn}
                onClick={toggleCategories}
                onMouseEnter={() => setShowCategories(true)}
              >
                All products
                <FiChevronDown style={styles.chevron} />
              </button>

              {showCategories && (
                <div
                  style={styles.dropdownMenu}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <Link to="/products" style={styles.dropdownItem}>
                    Browse All Products
                  </Link>
                  <div style={styles.dropdownDivider}></div>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      style={styles.dropdownItem}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Navigation Links */}
            <div style={{ ...styles.navLinks, display: isMobile ? 'none' : 'flex' }}>
              <Link to="/compare" style={styles.navLink}>
                Compare
              </Link>
              <Link to="/new-arrivals" style={styles.navLink}>
                New arrivals
              </Link>
              <Link to="/todays-deal" style={styles.navLink}>
                Today's deal
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button style={{ ...styles.mobileMenuToggle, display: isMobile ? 'block' : 'none' }} onClick={toggleMenu} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenu} onClick={() => setIsOpen(false)}>
          <div
            style={styles.mobileMenuContent}
            onClick={(e) => e.stopPropagation()}
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={styles.mobileMenuItem}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div style={styles.mobileCategories}>
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Categories</h3>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  style={styles.mobileCategoryItem}
                  onClick={() => setIsOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <Link to="/products" style={{ ...styles.mobileCategoryItem, borderBottom: 'none' }} onClick={() => setIsOpen(false)}>
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
