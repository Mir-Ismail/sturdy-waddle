import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../Styles/HeroSection.css";

const backgroundImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1950&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1099&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1950&q=80",
  "https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

function heroSection() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // Increased to 8 seconds for better viewing
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hero-section">
      {/* Background Image Carousel */}
      <div className="background-carousel">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            className="background-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2, 
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `url(${backgroundImages[bgIndex]})`
            }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>
          Find the <span className="gradient-text-green-blue">Best Products</span> at the{" "}
          <span className="gradient-text-purple-pink">Best Prices</span>
        </h1>
        <p>Compare from hundreds of vendors and make smarter decisions</p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Shopping
        </motion.button>
      </motion.div>

      {/* Image Indicators */}
      <div className="image-indicators">
        {backgroundImages.map((_, index) => (
          <motion.div
            key={index}
            className={`indicator ${index === bgIndex ? 'active' : ''}`}
            onClick={() => setBgIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </header>
  );
}

export default heroSection;
