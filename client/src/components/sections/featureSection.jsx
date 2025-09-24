import React from "react";
import { motion } from "framer-motion";
import "../../Styles/Home.css";

const features = [
  {
    title: "Clothing & Services",
    description: "Compare clothes, tailors, and service providers easily.",
    image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cars & Prices",
    description: "Find and compare cars based on price, mileage, and deals.",
    image: "https://images.unsplash.com/photo-1601925260644-c270a9f006b0?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Smart Suggestions",
    description: "Get personalized deals and recommendations based on your interests.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  },
];

const featureSection = () => {
  return (
    <section className="feature-section">
      <h2 className="section-title">
        What We <span className="gradient-text-blue-purple">Offer</span>
      </h2>
      <p className="section-subtitle">
        Discover our comprehensive comparison platform designed to help you make informed decisions
      </p>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <img src={feature.image} alt={feature.title} />
            <div className="card-content">
              <h3 className="gradient-text-green-blue">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default featureSection;
