// Dashboard.jsx
import React, { useState, useEffect } from "react";
import "../Styles/dashboard.css";
import { useAuth } from "../context/AuthContext";
import OrderHistory from "../components/user/OrderHistory";
import Favorites from "../components/user/Favorites";
import UserProfile from "./UserProfile";
import VendorDashboard from "../components/vendor/VendorDashboard";
import SalesAnalytics from "../components/vendor/SalesAnalytics";
import AdminDashboard from "../components/admin/AdminDashboard";
import UserList from "../components/admin/UserList";
import VendorList from "../components/admin/VendorList";
import SupplyPurchaseDetails from "../components/admin/SupplyPurchaseDetails";
import ProductModeration from "../components/admin/ProductModeration";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("comparisons");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch detailed user information
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, user]);

  // Set default tab based on user role
  useEffect(() => {
    if (user?.role) {
      const defaultTabs = {
        buyer: "saved",
        vendor: "overview",
        admin: "admin-dashboard"
      };
      setActiveTab(defaultTabs[user.role] || "comparisons");
    }
  }, [user?.role]);

  // Show loading state
  if (isLoading || loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-container">
        <div className="auth-error">
          <h2>Authentication Required</h2>
          <p>Please log in to access the dashboard.</p>
          <button onClick={() => window.location.href = "/login"}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // For vendor role, render the complete VendorDashboard
  if (user?.role === "vendor") {
    return <VendorDashboard />;
  }

  // For admin role, render the complete AdminDashboard
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  // For regular users, redirect to home page
  if (user?.role === "buyer") {
    return (
      <div className="dashboard-container">
        <div className="auth-error">
          <h2>Access Denied</h2>
          <p>Buyers don't have access to the dashboard.</p>
          <button onClick={() => window.location.href = "/"}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const roleComponents = {
    buyer: {
      saved: <Favorites />,
      "order-history": <OrderHistory />,
      favorites: <Favorites />,
      profile: <UserProfile user={userDetails || user} onLogout={logout} />,
    },
    admin: {
      "admin-dashboard": <AdminDashboardStats />,
      "user-management": <UserList />,
      "vendor-management": <VendorList />,
      "supply-purchase": <SupplyPurchaseDetails />,
      "product-moderation": <ProductModeration />,
    },
  };

  const currentRole = user?.role || "buyer";
  const availableComponents = roleComponents[currentRole] || {};
  const currentComponent = availableComponents[activeTab];

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {currentComponent ? (
          currentComponent
        ) : (
          <div className="no-component">
            <h2>Welcome to your Dashboard</h2>
            <p>Select a section from the navigation to get started.</p>
            <div className="user-info">
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
