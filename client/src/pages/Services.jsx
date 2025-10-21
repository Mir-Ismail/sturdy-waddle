import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiHeadphones,
  FiCreditCard,
  FiPackage,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import "./Services.css";

const Services = () => {
  const services = [
    {
      icon: FiShoppingCart,
      title: "Easy Shopping",
      description:
        "Browse thousands of products with our intuitive search and filtering system.",
      features: [
        "Advanced search",
        "Category filters",
        "Price comparison",
        "Wishlist management",
      ],
    },
    {
      icon: FiTruck,
      title: "Fast Delivery",
      description:
        "Get your products delivered quickly and safely to your doorstep.",
      features: [
        "Same-day delivery",
        "Track your order",
        "Multiple locations",
        "Secure packaging",
      ],
    },
    {
      icon: FiShield,
      title: "Secure Payments",
      description:
        "Shop with confidence using our secure payment processing system.",
      features: [
        "Multiple payment options",
        "SSL encryption",
        "Fraud protection",
        "Money-back guarantee",
      ],
    },
    {
      icon: FiHeadphones,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you.",
      features: [
        "Live chat support",
        "Phone support",
        "Email support",
        "FAQ section",
      ],
    },
    {
      icon: FiPackage,
      title: "Quality Assurance",
      description:
        "All products are verified and quality-checked before listing.",
      features: [
        "Product verification",
        "Quality checks",
        "Vendor screening",
        "Return policy",
      ],
    },
    {
      icon: FiUsers,
      title: "Vendor Platform",
      description:
        "Sell your products easily with our comprehensive vendor tools.",
      features: [
        "Easy product listing",
        "Sales analytics",
        "Inventory management",
        "Order processing",
      ],
    },
  ];

  const benefits = [
    {
      icon: FiTrendingUp,
      title: "Growing Market",
      description: "Join Pakistan's fastest-growing e-commerce platform",
    },
    {
      icon: FiShield,
      title: "Trusted Platform",
      description: "Secure and reliable shopping experience",
    },
    {
      icon: FiUsers,
      title: "Large Community",
      description: "Connect with thousands of customers and vendors",
    },
    {
      icon: FiCreditCard,
      title: "Flexible Payments",
      description: "Multiple payment options for your convenience",
    },
  ];

  return (
    <div className="services-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Discover everything MarketMatch has to offer for customers and
            vendors
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            What We Offer
          </motion.h2>
          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="service-card"
                >
                  <div className="service-icon">
                    <Icon />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Why Choose MarketMatch?
          </motion.h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="benefit-card"
                >
                  <Icon className="benefit-icon" />
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-title"
          >
            How It Works
          </motion.h2>
          <div className="steps-container">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="step"
            >
              <div className="step-number">1</div>
              <h3>Browse Products</h3>
              <p>
                Explore our vast collection of products from trusted vendors
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="step"
            >
              <div className="step-number">2</div>
              <h3>Add to Cart</h3>
              <p>
                Select your desired products and add them to your shopping cart
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="step"
            >
              <div className="step-number">3</div>
              <h3>Checkout</h3>
              <p>Complete your purchase with secure payment options</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="step"
            >
              <div className="step-number">4</div>
              <h3>Get Delivery</h3>
              <p>Receive your products at your doorstep with fast delivery</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <button className="btn-secondary">Become a Vendor</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
