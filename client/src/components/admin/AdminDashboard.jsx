import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboardStats from "./AdminDashboardStats";
import UserList from "./UserList";
import VendorList from "./VendorList";
import ProductModeration from "./ProductModeration";
import SupplyPurchaseDetails from "./SupplyPurchaseDetails";

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
    { id: "users", label: "Users", icon: FiUsers },
    { id: "vendors", label: "Vendors", icon: FiPackage },
    { id: "products", label: "Products", icon: FiShoppingCart },
    { id: "analytics", label: "Analytics", icon: FiTrendingUp },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminDashboardStats />;
      case "users":
        return <UserList />;
      case "vendors":
        return <VendorList />;
      case "products":
        return <ProductModeration />;
      case "analytics":
        return (
          <div className="text-center p-10 text-slate-600">
            <FiTrendingUp className="mx-auto w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800">
              Analytics Dashboard
            </h2>
            <p className="text-slate-500 mt-2">
              Insights & reports will appear here soon.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white/70 backdrop-blur-lg shadow-xl border-r border-slate-200 p-5 hidden md:flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-8">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                    }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 px-4 py-3 mt-10 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-md"
        >
          <FiLogOut />
          Logout
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your e-commerce operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
          </div>
        </div>

        {/* Animated Page Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-2xl p-8"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
