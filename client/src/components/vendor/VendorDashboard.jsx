import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import {
  FiPackage,
  FiBarChart,
  FiPlus,
  FiHome,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiX,
  FiUpload,
  FiSave,
  FiShoppingBag,
  FiDollarSign,
  FiEye,
  FiArrowUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SalesAnalytics from "./SalesAnalytics";

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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

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
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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

  const handleProductAdded = () => {
    if (productListRef.current?.fetchProducts) {
      productListRef.current.fetchProducts();
    }
    fetchDashboardStats();
    setShowAddProduct(false);
  };

  // Add this to your VendorDashboard.jsx

  // 1. Update the tabs array to include Orders:
  const tabs = [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "products", label: "Products", icon: FiPackage },
    { id: "orders", label: "Orders", icon: FiShoppingBag }, // NEW
    { id: "analytics", label: "Analytics", icon: FiBarChart },
  ];
  // Orders Section Component
  // Orders Section Component - Place this in VendorDashboard.jsx
  const OrdersSection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/vendor/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchOrders();
    }, []);

    const getStatusColor = (status) => {
      switch (status) {
        case "pending":
          return "border-yellow-500 text-yellow-700 bg-yellow-100";
        case "confirmed":
          return "border-green-500 text-green-700 bg-green-100";
        case "processing":
          return "border-blue-500 text-blue-700 bg-blue-100";
        case "shipped":
          return "border-indigo-500 text-indigo-700 bg-indigo-100";
        case "delivered":
          return "border-emerald-500 text-emerald-700 bg-emerald-100";
        case "cancelled":
          return "border-red-500 text-red-700 bg-red-100";
        default:
          return "border-gray-500 text-gray-700 bg-gray-100";
      }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/vendor/orders/${orderId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Update local state
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );

          // Update selected order if it's the one being updated
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }
        } else {
          throw new Error(data.message || "Failed to update order status");
        }
      } catch (err) {
        console.error("Error updating order status:", err);
        alert(err.message || "Network error while updating order");
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Order Management
          </h2>
          <p className="text-gray-600">Track and manage your customer orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Orders Yet
            </h3>
            <p className="text-gray-600">
              Orders containing your products will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Order
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Items
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-600">
                          #{order.orderNumber || order._id?.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress?.firstName ||
                            order.user?.firstName ||
                            ""}{" "}
                          {order.shippingAddress?.lastName ||
                            order.user?.lastName ||
                            ""}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.email ||
                            order.user?.email ||
                            "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700">
                          {order.items?.length || 0} item(s)
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-green-600">
                        PKR{" "}
                        {(
                          order.vendorSubtotal ||
                          order.total ||
                          0
                        ).toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onUpdateStatus={updateOrderStatus}
              getStatusColor={getStatusColor}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Order Details Modal Component
  /* eslint-disable react/prop-types */
  const OrderDetailsModal = ({
    order,
    onClose,
    onUpdateStatus,
    getStatusColor,
  }) => {
    return (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber || order._id?.slice(-8)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status and Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                <span
                  className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-blue-600" />
                Customer Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress?.firstName || ""}{" "}
                    {order.shippingAddress?.lastName || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    {order.shippingAddress?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    {order.shippingAddress?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-gray-900 flex items-start gap-2">
                    <FiMapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>
                      {order.shippingAddress?.street},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.zipCode}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items - Only vendor's items */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Items in This Order
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 bg-gray-50 rounded-xl p-4"
                  >
                    <img
                      src={item.product?.images?.[0] || "/placeholder.jpg"}
                      alt={item.product?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.product?.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold text-green-600">
                        PKR {item.price?.toLocaleString()} × {item.quantity} =
                        PKR{" "}
                        {(
                          item.total || item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Your Items Subtotal:</span>
                  <span className="font-semibold">
                    PKR {(order.vendorSubtotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Your Total:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    PKR {(order.vendorSubtotal || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 pt-2 border-t border-gray-200">
                  <span>Payment Method:</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMethod?.replace("_", " ") || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Payment Status:</span>
                  <span className="font-semibold capitalize">
                    {order.paymentStatus || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Customer Notes:
                </h4>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {order.status === "pending" && (
                <button
                  onClick={() => {
                    onUpdateStatus(order._id, "confirmed");
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <FiCheckCircle className="w-5 h-5" />
                  Confirm Order
                </button>
              )}

              {order.status === "confirmed" && (
                <button
                  onClick={() => {
                    onUpdateStatus(order._id, "processing");
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  <FiClock className="w-5 h-5" />
                  Start Processing
                </button>
              )}

              {order.status === "processing" && (
                <button
                  onClick={() => {
                    onUpdateStatus(order._id, "shipped");
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <FiPackage className="w-5 h-5" />
                  Mark as Shipped
                </button>
              )}

              {(order.status === "pending" || order.status === "confirmed") && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this order?"
                      )
                    ) {
                      onUpdateStatus(order._id, "cancelled");
                      onClose();
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  <FiXCircle className="w-5 h-5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  /* eslint-enable react/prop-types */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Vendor Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your products and track performance
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/50"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewSection loading={loading} stats={dashboardStats} />
          )}
          {activeTab === "products" && (
            <ProductsSection
              ref={productListRef}
              onAddProduct={() => setShowAddProduct(true)}
            />
          )}
          {activeTab === "orders" && <OrdersSection />} {/* NEW */}
          {activeTab === "analytics" && <SalesAnalytics />}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddProduct(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-600" />
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

// Overview Section Component
const OverviewSection = ({ loading, stats }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
      <p className="text-gray-600">
        Here&apos;s an overview of your business performance
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={FiPackage}
        title="Total Products"
        value={loading ? "..." : stats.totalProducts}
        change={loading ? "..." : `+${stats.productsThisMonth}`}
        changeLabel="this month"
        color="blue"
      />
      <StatCard
        icon={FiDollarSign}
        title="Total Sales"
        value={
          loading ? "..." : `PKR ${stats.totalSales?.toLocaleString() || 0}`
        }
        change={
          loading
            ? "..."
            : `+PKR ${stats.salesThisMonth?.toLocaleString() || 0}`
        }
        changeLabel="this month"
        color="green"
      />
      <StatCard
        icon={FiShoppingBag}
        title="Total Orders"
        value={loading ? "..." : stats.totalOrders}
        change={loading ? "..." : `+${stats.ordersThisMonth}`}
        changeLabel="this month"
        color="purple"
      />
    </div>
  </motion.div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, change, changeLabel, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-indigo-600",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
          <FiArrowUp className="w-4 h-4" />
          <span>Growth</span>
        </div>
      </div>
      <h3 className="text-gray-600 font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{change}</span>{" "}
        {changeLabel}
      </p>
    </motion.div>
  );
};

// Products Section Component
const ProductsSection = React.forwardRef(({ onAddProduct }, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/vendor/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useImperativeHandle(ref, () => ({ fetchProducts }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/vendor/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Product Management
            </h2>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiPackage className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Products Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first product
          </p>
          <button
            onClick={onAddProduct}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <FiPlus className="inline w-5 h-5 mr-2" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
});

// Product Card Component
const ProductCard = ({ product, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-2xl transition-all"
  >
    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
      {product.images?.[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <FiPackage className="w-16 h-16 text-gray-300" />
        </div>
      )}
      <div className="absolute top-3 right-3">
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold ${product.status === "approved"
            ? "bg-green-100 text-green-700"
            : product.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {product.status}
        </span>
      </div>
    </div>

    <div className="p-5">
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            PKR {product.price?.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Stock: {product.quantity}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
          <FiEdit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  </motion.div>
);

// Analytics Section Component

// Product Form Component
const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    brand: "",
    images: [],
    specifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Automotive",
    "Health & Beauty",
    "Toys & Games",
    "Food & Beverages",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length + imageFiles.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    const newImageFiles = [...imageFiles, ...validFiles];
    setImageFiles(newImageFiles);

    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
    setError(null);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imagePromises = imageFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/vendor/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            images: base64Images,
            specifications: formData.specifications.filter(
              (s) => s.key && s.value
            ),
          }),
        }
      );

      if (response.ok) {
        onProductAdded();
      } else {
        throw new Error("Failed to create product");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
            placeholder="Enter detailed product description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Price (PKR) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Product Images (Max 5)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2"
          >
            <FiUpload className="w-8 h-8 text-gray-400" />
            <span className="text-gray-600 font-medium">
              Click to upload images
            </span>
            <span className="text-sm text-gray-500">
              Max 5 images, 5MB each
            </span>
          </button>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Specifications Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-bold text-gray-900">
              Product Specifications (Optional)
            </label>
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors text-sm"
            >
              <FiPlus className="w-4 h-4" />
              Add Specification
            </button>
          </div>

          {formData.specifications.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">
                No specifications added yet
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Click &quot;Add Specification&quot; to add product details
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.specifications.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Specification name (e.g., Weight, Size, Color)"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(index, "key", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g., 2.5 kg, Large, Red)"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(index, "value", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex-shrink-0"
                    title="Remove specification"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FiSave className="w-5 h-5" />
            Upload Product
          </>
        )}
      </button>
    </form>
  );
};

ProductsSection.displayName = 'ProductsSection';

// PropTypes validation
OverviewSection.propTypes = {
  loading: PropTypes.bool.isRequired,
  stats: PropTypes.object.isRequired,
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string.isRequired,
  changeLabel: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

ProductsSection.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

ProductForm.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
};

export default VendorDashboard;
