import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
          
          // Verify token is still valid by making a request to /api/auth/me
          const response = await axios.get("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response.data.success) {
            setUser(response.data.user);
            // Update stored user info with fresh data
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } else {
            // Token is invalid, clear everything
            clearAuthData();
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          // Token is invalid or expired, clear everything
          clearAuthData();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userData = response.data;
      if (userData.success) {
        setUser(userData.user);
        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("token", userData.token);
        return { success: true, data: userData.user };
      } else {
        return {
          success: false,
          error: userData.error || "Login failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newUser = response.data;
      if (newUser.success) {
        setUser(newUser.user);
        localStorage.setItem("user", JSON.stringify(newUser.user));
        localStorage.setItem("token", newUser.token);
        return { success: true, data: newUser.user };
      } else {
        return {
          success: false,
          error: newUser.error || "Registration failed. Please try again.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
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
