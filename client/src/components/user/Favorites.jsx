import React, { useState, useEffect } from 'react';
import { FiHeart, FiTrash2, FiShoppingCart, FiEye, FiStar, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Remove from local state
      setFavorites(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  const getRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FiStar
          key={i}
          style={{
            width: "16px",
            height: "16px",
            color: "#fbbf24",
            fill: "currentColor",
          }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FiStar
          key="half"
          style={{
            width: "16px",
            height: "16px",
            color: "#fbbf24",
            fill: "currentColor",
            opacity: 0.7,
          }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FiStar
          key={`empty-${i}`}
          style={{ width: "16px", height: "16px", color: "#e2e8f0" }}
        />
      );
    }

    return stars;
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    header: {
      marginBottom: '3rem',
      textAlign: 'center',
      color: 'white',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: '0.9',
      fontWeight: '300',
    },
    content: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      minHeight: '600px',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '1.2rem',
      color: '#64748b',
    },
    error: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '1.2rem',
      color: '#dc2626',
      background: '#fef2f2',
      borderRadius: '12px',
      padding: '2rem',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      textAlign: 'center',
      color: '#64748b',
      padding: '4rem 2rem',
    },
    emptyIcon: {
      fontSize: '5rem',
      marginBottom: '1.5rem',
      color: '#94a3b8',
      opacity: '0.5',
    },
    emptyTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#374151',
    },
    emptyText: {
      fontSize: '1.1rem',
      color: '#64748b',
      maxWidth: '400px',
      lineHeight: '1.6',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #f1f5f9',
      position: 'relative',
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    imageContainer: {
      position: 'relative',
      height: '250px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    placeholderImage: {
      color: '#94a3b8',
      fontSize: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    },
    overlay: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      gap: '0.5rem',
    },
    removeButton: {
      background: 'rgba(239, 68, 68, 0.9)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    removeButtonHover: {
      background: 'rgba(239, 68, 68, 1)',
      transform: 'scale(1.1)',
    },
    details: {
      padding: '1.5rem',
    },
    productName: {
      margin: '0 0 0.75rem 0',
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1e293b',
      lineHeight: '1.3',
    },
    description: {
      color: '#64748b',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
      fontSize: '0.95rem',
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    stars: {
      display: 'flex',
      gap: '2px',
    },
    ratingText: {
      fontSize: '0.9rem',
      color: '#64748b',
      fontWeight: '500',
    },
    priceSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      padding: '1rem',
      background: '#f8fafc',
      borderRadius: '12px',
    },
    price: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#059669',
    },
    stock: {
      fontSize: '0.9rem',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    stockIcon: {
      color: '#059669',
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
    },
    btnPrimary: {
      flex: 1,
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    btnPrimaryHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
    },
    btnSecondary: {
      flex: 1,
      background: 'white',
      color: '#374151',
      border: '2px solid #e5e7eb',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
      textDecoration: 'none',
    },
    btnSecondaryHover: {
      background: '#f8fafc',
      borderColor: '#d1d5db',
      transform: 'translateY(-2px)',
    },
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.loading}>Loading your favorites...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Favorites</h1>
        <p style={styles.subtitle}>Products you've marked as favorites</p>
      </div>
      
      <div style={styles.content}>
        {favorites.length === 0 ? (
          <div style={styles.emptyState}>
            <FiHeart style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No favorites yet</h3>
            <p style={styles.emptyText}>
              Start exploring our products and add your favorites here. 
              You'll be able to quickly access them whenever you need!
            </p>
            <Link 
              to="/products" 
              style={{
                ...styles.btnPrimary,
                marginTop: '2rem',
                textDecoration: 'none',
                display: 'inline-flex'
              }}
            >
              <FiPackage /> Browse Products
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {favorites.map((item) => (
              <div key={item._id} style={styles.card}>
                <div style={styles.imageContainer}>
                  {item.product.images && item.product.images[0] ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>
                      <FiPackage style={{ fontSize: '2rem' }} />
                      No Image Available
                    </div>
                  )}
                  <div style={styles.overlay}>
                    <button 
                      style={styles.removeButton}
                      onClick={() => removeFromFavorites(item.product._id)}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 1)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div style={styles.details}>
                  <h3 style={styles.productName}>{item.product.name}</h3>
                  <p style={styles.description}>
                    {item.product.description?.substring(0, 120)}...
                  </p>
                  
                  <div style={styles.ratingSection}>
                    <div style={styles.stars}>{getRatingStars()}</div>
                    <span style={styles.ratingText}>(4.5)</span>
                  </div>
                  
                  <div style={styles.priceSection}>
                    <span style={styles.price}>PKR {item.product.price?.toLocaleString()}</span>
                    <span style={styles.stock}>
                      <FiPackage style={styles.stockIcon} />
                      {item.product.quantity > 0 ? `${item.product.quantity} available` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <div style={styles.actions}>
                    <button 
                      style={styles.btnPrimary}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <Link 
                      to={`/product/${item.product._id}`}
                      style={styles.btnSecondary}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <FiEye /> View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites; 