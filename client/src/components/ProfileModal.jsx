import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, User, Wallet, Grid, ShoppingCart, Heart, Clock, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function ProfileModal({ children }) {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout(); // Clear user data
    handleClose(); // Close modal
    navigate("/"); // Navigate to home page
  };

  const handleEditProfile = () => {
    handleClose(); // Close modal
    navigate(`/edit-profile/${user._id}`); // Navigate to edit profile page
  };

  const handleDashboard = () => {
    handleClose(); // Close modal
    navigate("/dashboard"); // Navigate to dashboard
  };

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    // Handle ESC key to close modal
    const handleEscKey = (event) => {
      if (event.key === "Escape" && show) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!user) return null;

  // Check if user is a customer (buyer)
  const isCustomer = () => {
    return user.role === "buyer" || !user.role;
  };

  // Check if user is a vendor or admin
  const isVendorOrAdmin = () => {
    return user.role === "vendor" || user.role === "admin";
  };

  // Inline styles
  const styles = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      padding: '1rem',
    },
    modal: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      width: '320px',
      maxHeight: '90vh',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10000,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem 1.5rem 1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    headerTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
    },
    closeButtonHover: {
      background: '#f3f4f6',
      color: '#374151',
    },
    userInfo: {
      padding: '1.5rem',
      textAlign: 'center',
      borderBottom: '1px solid #e5e7eb',
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    avatarImage: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    userName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 0.25rem 0',
    },
    userEmail: {
      fontSize: '0.875rem',
      color: '#6b7280',
      margin: 0,
    },
    menuList: {
      padding: '1rem 0',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      color: '#374151',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      width: '100%',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    menuItemHover: {
      background: '#f8fafc',
      color: '#1e293b',
    },
    menuIcon: {
      width: '20px',
      height: '20px',
      marginRight: '0.75rem',
      color: '#6b7280',
    },
    menuText: {
      flex: 1,
      textAlign: 'left',
    },
    logoutSection: {
      padding: '1rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      background: '#f8fafc',
    },
    logoutButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
    },
    logoutButtonHover: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      transform: 'translateY(-1px)',
    },
  };

  return (
    <>
      {/* Trigger element */}
      {children ? (
        <div onClick={handleShow} style={{ cursor: "pointer" }}>
          {children}
        </div>
      ) : (
        <div
          onClick={handleShow}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
        >
          <User style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.backdrop}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, x: 300, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={styles.modal}
            >
              {/* Header */}
              <div style={styles.header}>
                <h2 style={styles.headerTitle}>Profile</h2>
                <button
                  onClick={handleClose}
                  style={styles.closeButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* User Info */}
              <div style={styles.userInfo}>
                {user.pic ? (
                  <img
                    src={user.pic}
                    alt={user.name}
                    style={styles.avatarImage}
                  />
                ) : (
                  <div style={styles.avatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 style={styles.userName}>
                  {user.name || user.email}
                </h3>
                <p style={styles.userEmail}>{user.email}</p>
              </div>

              {/* Menu Items */}
              <div style={styles.menuList}>
                {/* Dashboard - Only for vendors and admins */}
                {isVendorOrAdmin() && (
                  <button 
                    onClick={handleDashboard}
                    style={styles.menuItem}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.color = '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }}
                  >
                    <Grid style={styles.menuIcon} />
                    <span style={styles.menuText}>Dashboard</span>
                  </button>
                )}

                {/* Customer-specific actions */}
                {isCustomer() && (
                  <>
                    <Link 
                      to="/cart"
                      onClick={handleClose}
                      style={styles.menuItem}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <ShoppingCart style={styles.menuIcon} />
                      <span style={styles.menuText}>My Cart</span>
                    </Link>

                    <Link 
                      to="/wishlist"
                      onClick={handleClose}
                      style={styles.menuItem}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <Heart style={styles.menuIcon} />
                      <span style={styles.menuText}>Wishlist</span>
                    </Link>

                    <Link 
                      to="/favorites"
                      onClick={handleClose}
                      style={styles.menuItem}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <Star style={styles.menuIcon} />
                      <span style={styles.menuText}>Favorites</span>
                    </Link>

                    <Link 
                      to="/order-history"
                      onClick={handleClose}
                      style={styles.menuItem}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      <Clock style={styles.menuIcon} />
                      <span style={styles.menuText}>Order History</span>
                    </Link>
                  </>
                )}

                {/* Common actions for all users */}
                <button 
                  onClick={handleEditProfile}
                  style={styles.menuItem}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#374151';
                  }}
                >
                  <User style={styles.menuIcon} />
                  <span style={styles.menuText}>Edit Profile</span>
                </button>

                <Link 
                  to="/wallet"
                  onClick={handleClose}
                  style={styles.menuItem}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#374151';
                  }}
                >
                  <Wallet style={styles.menuIcon} />
                  <span style={styles.menuText}>My Wallet</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div style={styles.logoutSection}>
                <button
                  onClick={handleLogout}
                  style={styles.logoutButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <LogOut style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProfileModal;
