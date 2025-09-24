import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import ProductCard from "../ProductCard";
import "./ProductSection.css";

const ProductSection = ({
  title,
  subtitle,
  products,
  emptyMessage,
  emptyIcon,
  showViewAll = false,
  viewAllLink = "/products",
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!products || products.length === 0) {
    return (
      <motion.section
        className="product-section empty-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-header">
            <motion.h2 className="section-title" variants={itemVariants}>
              {title}
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              {subtitle}
            </motion.p>
          </div>

          <motion.div className="empty-state" variants={itemVariants}>
            <div className="empty-icon">{emptyIcon}</div>
            <h3>{emptyMessage}</h3>
            <p>
              We're working on bringing you amazing products in this category!
            </p>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Always show exactly 4 products for consistent layout
  const displayedProducts = products.slice(0, 4);

  return (
    <motion.section
      className="product-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="section-header">
          <motion.div className="header-content" variants={itemVariants}>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </motion.div>

          {showViewAll && (
            <motion.div className="header-action" variants={itemVariants}>
              <Link to={viewAllLink} className="view-all-btn">
                View All
                <FiArrowRight />
              </Link>
            </motion.div>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={itemVariants}
        >
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product._id}
              className="product-wrapper"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {products.length > 4 && (
          <motion.div className="section-footer" variants={itemVariants}>
            <Link to={viewAllLink} className="load-more-btn">
              View All {products.length} Products
              <FiArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ProductSection;
