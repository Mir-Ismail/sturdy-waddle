import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");

      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);

          // First set the user from localStorage for immediate UI update
          setUser(parsedUser);

          // Then verify token is still valid
          const response = await authApi.getProfile();

          if (response.success) {
            setUser(response.user);
            localStorage.setItem("user", JSON.stringify(response.user));
          } else {
            clearAuthData();
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          // Only clear if it's a 401/403 error, otherwise keep the user logged in
          if (error.status === 401 || error.status === 403) {
            clearAuthData();
          } else {
            // Network error - keep user logged in with cached data
            console.log("Network error, using cached user data");
          }
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []); // This only runs once on mount

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        return { success: true, data: response.user };
      } else {
        return {
          success: false,
          error: response.error || "Login failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.error || error.message || "Login failed. Please check your internet connection.",
      };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        return { success: true, data: response.user };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.error || error.message || "Registration failed. Please check your internet connection.",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};