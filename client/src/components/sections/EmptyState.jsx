import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPackage, FiPlus, FiArrowRight, FiSearch, FiRefreshCw } from "react-icons/fi";

const EmptyState = ({
  icon = "📦",
  title = "No Items Found",
  message = "There are no items to display at the moment.",
  showAddButton = false,
  showButton = true,
  buttonText = "Add Your First Product",
  buttonLink = "/dashboard",
  showSearchButton = false,
  searchButtonText = "Browse Products",
  searchButtonLink = "/products",
  showRefreshButton = false,
  onRefresh = null,
  size = "default", // "sm", "default", "lg"
  variant = "default" // "default", "search", "error", "success"
}) => {

  const sizeClasses = {
    sm: {
      container: "py-12",
      icon: "text-4xl w-16 h-16",
      title: "text-xl",
      message: "text-sm",
      button: "px-4 py-2 text-sm"
    },
    default: {
      container: "py-20",
      icon: "text-6xl w-24 h-24",
      title: "text-2xl",
      message: "text-base",
      button: "px-6 py-3 text-base"
    },
    lg: {
      container: "py-32",
      icon: "text-8xl w-32 h-32",
      title: "text-3xl",
      message: "text-lg",
      button: "px-8 py-4 text-lg"
    }
  };

  const variantStyles = {
    default: {
      bg: "from-gray-50 to-blue-50",
      iconBg: "bg-gray-100",
      titleColor: "text-gray-900",
      messageColor: "text-gray-600"
    },
    search: {
      bg: "from-blue-50 to-purple-50",
      iconBg: "bg-blue-100",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700"
    },
    error: {
      bg: "from-red-50 to-orange-50",
      iconBg: "bg-red-100",
      titleColor: "text-red-900",
      messageColor: "text-red-700"
    },
    success: {
      bg: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      titleColor: "text-green-900",
      messageColor: "text-green-700"
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantStyles[variant];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center ${currentSize.container} bg-gradient-to-br ${currentVariant.bg} rounded-3xl relative overflow-hidden`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full"
          animate={floatingAnimation}
          transition={{ delay: 1, ...floatingAnimation.transition }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-pink-400/30 rounded-full"
          animate={floatingAnimation}
          transition={{ delay: 2, ...floatingAnimation.transition }}
        />
      </div>

      <div className="text-center max-w-2xl mx-auto px-8 relative z-10">

        {/* Icon */}
        <motion.div
          className="flex items-center justify-center mx-auto mb-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <div className={`${currentSize.icon} ${currentVariant.iconBg} rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20 group-hover:shadow-xl transition-all duration-300`}>
            <span className={currentSize.icon}>{icon}</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div className="space-y-6 mb-8" variants={itemVariants}>
          <h3 className={`${currentSize.title} font-bold ${currentVariant.titleColor}`}>
            {title}
          </h3>

          <p className={`${currentSize.message} ${currentVariant.messageColor} max-w-lg mx-auto leading-relaxed`}>
            {message}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          variants={itemVariants}
        >
          {/* Primary Action Button */}
          {showButton && showAddButton && (
            <Link
              to={buttonLink}
              className={`group inline-flex items-center space-x-3 ${currentSize.button} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              <span>{buttonText}</span>
            </Link>
          )}

          {/* Search Button */}
          {showSearchButton && (
            <Link
              to={searchButtonLink}
              className={`group inline-flex items-center space-x-3 ${currentSize.button} bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <FiSearch className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <span>{searchButtonText}</span>
              <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          )}

          {/* Refresh Button */}
          {showRefreshButton && onRefresh && (
            <button
              onClick={onRefresh}
              className={`group inline-flex items-center space-x-3 ${currentSize.button} bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
              <span>Try Again</span>
            </button>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="pt-8 space-y-4"
          variants={itemVariants}
        >
          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quality Products</h4>
              <p className="text-sm text-gray-600">Curated selection from trusted vendors</p>
            </div>

            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FiSearch className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Discovery</h4>
              <p className="text-sm text-gray-600">Find exactly what you're looking for</p>
            </div>

            <div className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FiArrowRight className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Compare</h4>
              <p className="text-sm text-gray-600">Compare prices and features easily</p>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t border-white/20">
            <p className="text-sm text-gray-500">
              Need help? <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact our support team</Link> for assistance.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyState;