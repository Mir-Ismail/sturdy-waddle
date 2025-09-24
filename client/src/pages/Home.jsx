import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/sections/heroSection";
import ProductSection from "../components/sections/ProductSection";
import EmptyState from "../components/sections/EmptyState";
import axios from "axios";
import "../Styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.products || []);
      } catch (err) {
        setError(err.message);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper functions to filter products
  const getNewArrivals = () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return products
      .filter((product) => new Date(product.createdAt) > oneWeekAgo)
      .slice(0, 8);
  };

  const getTrendingProducts = () => {
    // Sort by views or sales in a real app
    return [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8);
  };

  const getProductsByCategory = (category) => {
    return products.filter(
      (product) => product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  const getElectronicsProducts = () => {
    const electronicsCategories = [
      "pcs & laptop",
      "gadgets",
      "audio & video",
      "smart home",
    ];
    return products.filter((product) =>
      electronicsCategories.includes(product.category?.toLowerCase())
    );
  };

  const getOtherProducts = () => {
    const mainCategories = [
      "pcs & laptop",
      "gadgets",
      "audio & video",
      "smart home",
      "air conditioner",
      "kitchen appliances",
      "refrigerator",
      "home appliances",
    ];
    return products.filter(
      (product) => !mainCategories.includes(product.category?.toLowerCase())
    );
  };

  const getUniqueCategories = () => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ].filter(Boolean);

    // Sort categories alphabetically
    return categories.sort((a, b) => a.localeCompare(b));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate all product sections
  const newArrivals = getNewArrivals();
  const trendingProducts = getTrendingProducts();
  const electronicsProducts = getElectronicsProducts();
  const otherProducts = getOtherProducts();
  const categories = getUniqueCategories();

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh products just added to our collection"
        products={newArrivals}
        loading={loading}
      />

      {/* Trending Products */}
      <ProductSection
        title="Trending Now"
        subtitle="Most popular products this week"
        products={trendingProducts}
        loading={loading}
      />

      {/* Electronics
      <ProductSection
        title="Electronics"
        subtitle="Latest gadgets and tech innovations"
        products={electronicsProducts}
        loading={loading}
      /> */}

      {/* Category Sections */}
      <div className="chking">
        {categories.map((category) => (
          <ProductSection
            key={category}
            title={category}
            subtitle={`Best ${category.toLowerCase()} for you`}
            products={getProductsByCategory(category)}
            loading={loading}
          />
        ))}
      </div>

      {/* Other Products */}
      {otherProducts.length > 0 && (
        <ProductSection
          title="More Products"
          subtitle="Discover more amazing items"
          products={otherProducts}
          loading={loading}
        />
      )}

      {/* Empty State */}
      {products.length === 0 && !loading && (
        <EmptyState
          title="No Products Available"
          message="We're working hard to bring you amazing products. Check back soon!"
          icon="🛍️"
        />
      )}
    </motion.div>
  );
};

export default Home;
