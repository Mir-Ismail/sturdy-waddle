import React, { useState, useEffect } from 'react';
import { FiPackage, FiAlertTriangle, FiCheck, FiX, FiSearch, FiEye } from 'react-icons/fi';

const ProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8234/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const revokeProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to revoke this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8234/api/admin/products/${productId}/revoke`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to revoke product');
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, status: 'revoked' }
          : product
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const reactivateProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to reactivate this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8234/api/admin/products/${productId}/reactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate product');
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, status: 'active' }
          : product
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading">Loading products for moderation...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-moderation">
      <div className="page-header">
        <h2>Product Moderation</h2>
        <p>Review and manage products uploaded by vendors</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="moderation-stats">
        <div className="stat-item">
          <FiPackage />
          <span>Total Products: {products.length}</span>
        </div>
        <div className="stat-item">
          <FiCheck />
          <span>Active: {products.filter(p => p.status === 'active').length}</span>
        </div>
        <div className="stat-item">
          <FiX />
          <span>Revoked: {products.filter(p => p.status === 'revoked').length}</span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} />
          <p>No products found</p>
          {searchTerm && <p>Try adjusting your search terms</p>}
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Vendor</th>
                <th>Price (PKR)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Added Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className={`product-row ${product.status}`}>
                  <td>
                    <div className="product-info">
                      <div className="product-image">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="placeholder">No Image</div>
                        )}
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <p className="description">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="vendor-info">
                      <span>{product.vendor.username}</span>
                      <small>{product.vendor.email}</small>
                    </div>
                  </td>
                  <td>PKR {product.price}</td>
                  <td>
                    <span className={`stock-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>{formatDate(product.createdAt)}</td>
                  <td>
                    <div className="moderation-actions">
                      <button className="btn-secondary" title="View Details">
                        <FiEye />
                      </button>
                      {product.status === 'active' ? (
                        <button 
                          className="btn-danger"
                          onClick={() => revokeProduct(product._id)}
                          title="Revoke Product"
                        >
                          <FiX />
                        </button>
                      ) : (
                        <button 
                          className="btn-success"
                          onClick={() => reactivateProduct(product._id)}
                          title="Reactivate Product"
                        >
                          <FiCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Moderation Guidelines */}
      <div className="moderation-guidelines">
        <h3>Moderation Guidelines</h3>
        <div className="guidelines-content">
          <div className="guideline-item">
            <FiAlertTriangle />
            <div>
              <h4>When to Revoke a Product</h4>
              <ul>
                <li>Inappropriate or offensive content</li>
                <li>Counterfeit or illegal items</li>
                <li>Misleading product descriptions</li>
                <li>Violation of platform policies</li>
              </ul>
            </div>
          </div>
          <div className="guideline-item">
            <FiCheck />
            <div>
              <h4>When to Reactivate</h4>
              <ul>
                <li>Content has been corrected</li>
                <li>Policy violation resolved</li>
                <li>False positive review</li>
                <li>Vendor has appealed successfully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModeration; 