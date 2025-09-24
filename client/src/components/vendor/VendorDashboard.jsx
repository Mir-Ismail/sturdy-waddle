import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiBarChart,
  FiPlus,
  FiList,
  FiHome,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import SalesAnalytics from "./SalesAnalytics";
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    productsThisMonth: 0,
    ordersThisMonth: 0,
    salesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const productListRef = useRef();
  const analyticsRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch dashboard statistics
      const response = await fetch(
        "http://localhost:5000/api/vendor/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      } else {
        // setError("Failed to fetch dashboard stats"); // Original code had this line commented out
      }
    } catch (error) {
      // setError("Error fetching dashboard stats"); // Original code had this line commented out
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "products", label: "Add Product", icon: FiPackage },
    { id: "analytics", label: "Analytics", icon: FiBarChart },
  ];

  const refreshProductList = () => {
    if (productListRef.current && productListRef.current.fetchProducts) {
      productListRef.current.fetchProducts();
    }
  };

  const handleProductAdded = () => {
    refreshProductList();
    fetchDashboardStats(); // Refresh dashboard stats when product is added
    // Refresh analytics if it's currently active
    if (analyticsRef.current && analyticsRef.current.refresh) {
      analyticsRef.current.refresh();
    }
    setShowAddProduct(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="overview-section"
          >
            <div className="overview-header">
              <h2>Welcome to Your Vendor Dashboard</h2>
              <p>Manage your products and track your sales performance</p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FiPackage />
                </div>
                <div className="stat-content">
                  <h3>Total Products</h3>
                  <p className="stat-number">
                    {loading ? "..." : dashboardStats.totalProducts}
                  </p>
                  <p className="stat-change">
                    +{loading ? "..." : dashboardStats.productsThisMonth} this
                    month
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiBarChart />
                </div>
                <div className="stat-content">
                  <h3>Total Sales</h3>
                  <p className="stat-number">
                    {loading
                      ? "..."
                      : `PKR ${
                          dashboardStats.totalSales?.toLocaleString() || 0
                        }`}
                  </p>
                  <p className="stat-change">
                    +
                    {loading
                      ? "..."
                      : `PKR ${
                          dashboardStats.salesThisMonth?.toLocaleString() || 0
                        }`}{" "}
                    this month
                  </p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiList />
                </div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-number">
                    {loading ? "..." : dashboardStats.totalOrders}
                  </p>
                  <p className="stat-change">
                    +{loading ? "..." : dashboardStats.ordersThisMonth} this
                    month
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "products":
        return (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="products-section"
          >
            <div className="section-header">
              <h2>Product Management</h2>
              <motion.button
                className="btn-primary add-product-btn"
                onClick={() => setShowAddProduct(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus /> Add Product
              </motion.button>
            </div>
            <ProductList
              ref={productListRef}
              onAddProduct={() => setShowAddProduct(true)}
            />
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="analytics-section"
          >
            <div className="section-header">
              <h2>Sales Analytics</h2>
            </div>
            <SalesAnalytics ref={analyticsRef} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Vendor Dashboard</h1>
            <p>Manage your products and track performance</p>
          </div>
          <motion.button
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLogOut />
            <span>Logout</span>
          </motion.button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddProduct(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Product</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddProduct(false)}
                >
                  ×
                </button>
              </div>
              <ProductForm onProductAdded={handleProductAdded} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboard;
