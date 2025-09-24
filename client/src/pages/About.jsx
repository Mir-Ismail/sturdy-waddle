import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiTarget,
  FiAward,
  FiHeart,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import "./About.css";

const About = () => {
  const stats = [
    { number: "10K+", label: "Happy Customers", icon: FiHeart },
    { number: "500+", label: "Products", icon: FiTarget },
    { number: "50+", label: "Vendors", icon: FiUsers },
    { number: "24/7", label: "Support", icon: FiShield },
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Customer First",
      description:
        "We prioritize our customers' satisfaction above everything else.",
    },
    {
      icon: FiShield,
      title: "Trust & Security",
      description:
        "Your data and transactions are protected with the highest security standards.",
    },
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery to your doorstep across Pakistan.",
    },
    {
      icon: FiAward,
      title: "Quality Assured",
      description:
        "All products are verified and quality-checked before listing.",
    },
  ];

  const team = [
    {
      name: "Ahmed Khan",
      role: "CEO & Founder",
      image: "/team/ceo.jpg",
      description: "Visionary leader with 10+ years in e-commerce",
    },
    {
      name: "Fatima Ali",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Tech expert driving innovation and digital transformation",
    },
    {
      name: "Usman Hassan",
      role: "Head of Operations",
      image: "/team/operations.jpg",
      description: "Ensuring smooth operations and customer satisfaction",
    },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            About MarketMatch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Connecting customers with quality products and trusted vendors
            across Pakistan
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mission-content"
          >
            <h2>Our Mission</h2>
            <p>
              At MarketMatch, we believe in creating a seamless shopping
              experience that connects customers with the best products and
              trusted vendors. Our platform is designed to make online shopping
              simple, secure, and satisfying for everyone in Pakistan.
            </p>
            <p>
              We strive to support local businesses while providing customers
              with access to quality products at competitive prices. Our
              commitment to excellence drives us to continuously improve our
              services and expand our reach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="stat-card"
                >
                  <Icon className="stat-icon" />
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Our Values
          </motion.h2>
          <div className="values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="value-card"
                >
                  <Icon className="value-icon" />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Meet Our Team
          </motion.h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="team-card"
              >
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>Ready to Get Started?</h2>
            <p>
              Join thousands of satisfied customers and vendors on MarketMatch
            </p>
            <div className="cta-buttons">
              <button className="btn">Start Shopping</button>
              <button className="btn-secondary">Contact Us</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
