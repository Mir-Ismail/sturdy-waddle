import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPackage, FiPlus } from "react-icons/fi";

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  showAddButton = false, 
  showButton = true,
  buttonText = "Add Your First Product",
  buttonLink = "/dashboard"
}) => {
  return (
    <motion.section 
      className="empty-state-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <div className="empty-state-content">
          <motion.div 
            className="empty-icon"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="icon-emoji">{icon}</span>
          </motion.div>
          
          <motion.h2 
            className="empty-title gradient-text-blue-purple"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="empty-message"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {message}
          </motion.p>

          {showButton && showAddButton && (
            <motion.div 
              className="empty-actions"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to={buttonLink} className="add-product-btn">
                <FiPlus />
                <span>{buttonText}</span>
              </Link>
            </motion.div>
          )}

          <motion.div 
            className="empty-decoration"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default EmptyState; 