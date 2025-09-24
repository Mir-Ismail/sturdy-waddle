import React from "react";
import { motion } from "framer-motion";
import "../../Styles/Home.css";

const steps = [
  {
    title: "Browse Products",
    desc: "Use powerful search and filters to explore thousands of listings.",
    icon: "🔍",
  },
  {
    title: "Compare & Decide",
    desc: "Side-by-side comparisons with pricing, reviews, and features.",
    icon: "⚖️",
  },
  {
    title: "Buy or Save",
    desc: "Buy immediately or save your cart/collection for later.",
    icon: "🛒",
  },
];

const technologySection = () => {
  return (
    <section className="tech-section">
      <h2 className="section-title">
        How It <span className="gradient-text-orange-red">Works</span>
      </h2>
      <p className="section-subtitle">
        Simple steps to find the perfect products at the best prices
      </p>
      <div className="steps">
        {steps.map((step, index) => (
          <motion.div
            className="step-card"
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="step-icon">{step.icon}</div>
            <h3 className="gradient-text-purple-pink">{step.title}</h3>
            <p>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default technologySection;