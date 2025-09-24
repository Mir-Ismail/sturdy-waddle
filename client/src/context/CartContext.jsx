import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        setCartItems([]);
        return;
      }

      const response = await fetch("http://localhost:5000/api/user/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        const count = data.length; // Count unique items instead of total quantity
        setCartCount(count);
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
      setCartItems([]);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("Please login to add items to cart");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/user/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Refresh cart count
      await fetchCartCount();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh cart count
        await fetchCartCount();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (response.ok) {
        // Refresh cart count
        await fetchCartCount();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  // Fetch cart count when authentication status changes
  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated]);

  const value = {
    cartCount,
    cartItems,
    fetchCartCount,
    updateCartCount,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 