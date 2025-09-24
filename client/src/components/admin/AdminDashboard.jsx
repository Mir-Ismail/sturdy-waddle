import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
  FiHome,
  FiShield,
  FiBox,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboardStats from "./AdminDashboardStats";
import UserList from "./UserList";
import VendorList from "./VendorList";
import ProductModeration from "./ProductModeration";
import SupplyPurchaseDetails from "./SupplyPurchaseDetails";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "users", label: "User Management", icon: FiUsers },
    { id: "vendors", label: "Vendor Management", icon: FiPackage },
    // { id: "products", label: "Product Moderation", icon: FiBox },
    // { id: "supply", label: "Supply & Purchase", icon: FiShoppingCart },
    // { id: "analytics", label: "Analytics", icon: FiTrendingUp },
  ];

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
            <AdminDashboardStats />
          </motion.div>
        );

      case "users":
        return (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="users-section"
          >
            <UserList />
          </motion.div>
        );

      case "vendors":
        return (
          <motion.div
            key="vendors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="vendors-section"
          >
            <VendorList />
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
            <ProductModeration />
          </motion.div>
        );

      case "supply":
        return (
          <motion.div
            key="supply"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="supply-section"
          >
            <SupplyPurchaseDetails />
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
            <div className="analytics-placeholder">
              <FiTrendingUp size={64} />
              <h2>Analytics Dashboard</h2>
              <p>
                Advanced analytics and reporting features will be available here
              </p>
              <div className="analytics-features">
                <div className="feature-item">
                  <FiTrendingUp />
                  <span>Sales Analytics</span>
                </div>
                <div className="feature-item">
                  <FiUsers />
                  <span>User Growth</span>
                </div>
                <div className="feature-item">
                  <FiPackage />
                  <span>Product Performance</span>
                </div>
                <div className="feature-item">
                  <FiShoppingCart />
                  <span>Order Analytics</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Manage your e-commerce platform</p>
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
        <div className="nav-container">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
