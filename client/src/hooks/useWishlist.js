import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useWishlist(initial = false) {
  const [isWishlisted, setIsWishlisted] = useState(initial);
  const navigate = useNavigate();

  const toggleWishlist = async (e, productId) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (isWishlisted) {
        await axios.delete(
          `http://localhost:5000/api/user/wishlist/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/user/wishlist",
          { productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    }
  };

  return { isWishlisted, setIsWishlisted, toggleWishlist };
}
