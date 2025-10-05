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
  FiMapPin,
  FiHeadphones,
  FiSettings,
  FiLogOut,
  FiCreditCard,
  FiEye,
  FiShield
} from "react-icons/fi";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleSearch = () => {
    const q = query.trim();
    if (q.length > 0) navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FiHeadphones className="w-4 h-4" />
                <span className="hidden sm:inline">24/7 Support: 1-800-234-5678</span>
                <span className="sm:hidden">24/7 Support</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2">
                <FiTruck className="w-4 h-4" />
                <span>Free Shipping Over $99</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>Store Locator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'} bg-white border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Market
                  </span>
                  <span className="text-gray-800">Match</span>
                </h1>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           bg-gray-50 hover:bg-white transition-colors duration-200
                           text-sm placeholder-gray-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center
                           text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  onClick={handleSearch}
                >
                  <div className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-lg 
                                flex items-center justify-center transition-colors duration-200">
                    <FiSearch className="h-4 w-4 text-white" />
                  </div>
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Customer Actions */}
                  {isCustomer() && (
                    <>
                      {/* Wishlist */}
                      <Link
                        to="/wishlist"
                        className="relative p-2 text-gray-600 hover:text-blue-600 
                                 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <FiHeart className="w-6 h-6" />
                      </Link>

                      {/* Cart */}
                      <Link
                        to="/cart"
                        className="relative p-2 text-gray-600 hover:text-blue-600 
                                 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <FiShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 
                                         text-white text-xs rounded-full flex items-center 
                                         justify-center font-medium">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* Vendor/Admin Actions */}
                  {isVendorOrAdmin() && (
                    <>
                      {/* Notifications */}
                      <button className="relative p-2 text-gray-600 hover:text-blue-600 
                                       hover:bg-blue-50 rounded-xl transition-all duration-200">
                        <FiBell className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 
                                       text-white text-xs rounded-full flex items-center 
                                       justify-center font-medium">
                          3
                        </span>
                      </button>

                      {/* Dashboard */}
                      <Link
                        to="/dashboard"
                        className="relative p-2 text-gray-600 hover:text-blue-600 
                                 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <FiGrid className="w-6 h-6" />
                      </Link>
                    </>
                  )}

                  {/* User Profile */}
                  <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="relative">
                      <ProfileModal>
                        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer">
                          {user?.pic ? (
                            <img
                              src={user.pic}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 
                                          rounded-full flex items-center justify-center">
                              <FiUser className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="hidden lg:block text-left">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || user?.email}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {user?.role || 'Customer'}
                            </p>
                          </div>
                          <FiChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </ProfileModal>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 
                             hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white text-sm font-medium rounded-xl 
                             hover:from-blue-700 hover:to-purple-700 
                             transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 
                         hover:bg-blue-50 rounded-xl transition-all duration-200"
                onClick={toggleMenu}
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium 
                           text-gray-700 hover:text-blue-600 hover:bg-blue-50 
                           rounded-xl transition-all duration-200"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                >
                  <FiGrid className="w-4 h-4" />
                  <span>All Categories</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {/* Categories Dropdown Menu */}
                {showCategories && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl 
                             shadow-xl border border-gray-100 z-50 py-2"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    <Link
                      to="/products"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 
                               hover:text-blue-600 transition-colors duration-200 
                               border-b border-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <FiGrid className="w-4 h-4" />
                        <span className="font-medium">Browse All Products</span>
                      </div>
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 
                                 hover:text-blue-600 transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <Link
                  to="/new-arrivals"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 
                           transition-colors duration-200 relative group"
                >
                  New Arrivals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                                 group-hover:w-full transition-all duration-200"></span>
                </Link>
                <Link
                  to="/todays-deal"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 
                           transition-colors duration-200 relative group"
                >
                  Today's Deals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                                 group-hover:w-full transition-all duration-200"></span>
                </Link>
                <Link
                  to="/compare"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 
                           transition-colors duration-200 relative group"
                >
                  Compare
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                                 group-hover:w-full transition-all duration-200"></span>
                </Link>
              </div>
            </div>

            {/* Right side info */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FiTruck className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 
                         hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-blue-50 
                           hover:text-blue-600 rounded-xl transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <h3 className="px-4 text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:bg-blue-50 
                               hover:text-blue-600 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    className="block w-full text-left py-2 px-4 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;