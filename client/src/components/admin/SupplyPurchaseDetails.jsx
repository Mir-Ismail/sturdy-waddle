import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiPackage, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';

const SupplyPurchaseDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchSupplyPurchaseData();
  }, []);

  const fetchSupplyPurchaseData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8234/api/admin/supply-purchase', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supply/purchase data');
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading supply/purchase data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="supply-purchase">
      <div className="page-header">
        <h2>Supply & Purchase Details</h2>
        <p>Comprehensive overview of all products and transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <FiPackage />
          <div>
            <h3>Total Products</h3>
            <p>{data.products.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <FiShoppingCart />
          <div>
            <h3>Total Orders</h3>
            <p>{data.orders.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <FiDollarSign />
          <div>
            <h3>Total Revenue</h3>
            <p>
              {formatCurrency(
                data.orders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <FiPackage /> Products Supply
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingCart /> Purchase Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="products-section">
          <h3>Product Supply Details</h3>
          {data.products.length === 0 ? (
            <div className="empty-state">
              <FiPackage size={48} />
              <p>No products available</p>
            </div>
          ) : (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Vendor</th>
                    <th>Price (PKR)</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product._id}>
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
                          <FiUsers />
                          <span>{product.vendor.username}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(product.price)}</td>
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
                      <td>
                        <div className="date-cell">
                          <FiCalendar />
                          <span>{formatDate(product.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <h3>Purchase Order Details</h3>
          {data.orders.length === 0 ? (
            <div className="empty-state">
              <FiShoppingCart size={48} />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Vendor</th>
                    <th>Quantity</th>
                    <th>Total Price (PKR)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">#{order._id.slice(-6)}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <FiUsers />
                          <span>{order.user.username}</span>
                        </div>
                      </td>
                      <td>
                        <div className="product-info">
                          <strong>{order.product.name}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="vendor-info">
                          <FiPackage />
                          <span>{order.vendor.username}</span>
                        </div>
                      </td>
                      <td>{order.quantity}</td>
                      <td>{formatCurrency(order.price * order.quantity)}</td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar />
                          <span>{formatDate(order.date)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="analytics-summary">
        <h3>Analytics Summary</h3>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>Top Selling Products</h4>
            <div className="analytics-content">
              {data.orders.length > 0 ? (
                <ul>
                  {Object.entries(
                    data.orders.reduce((acc, order) => {
                      const productName = order.product.name;
                      acc[productName] = (acc[productName] || 0) + order.quantity;
                      return acc;
                    }, {})
                  )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([name, quantity]) => (
                      <li key={name}>
                        <span>{name}</span>
                        <span>{quantity} sold</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No sales data available</p>
              )}
            </div>
          </div>

          <div className="analytics-card">
            <h4>Top Performing Vendors</h4>
            <div className="analytics-content">
              {data.orders.length > 0 ? (
                <ul>
                  {Object.entries(
                    data.orders.reduce((acc, order) => {
                      const vendorName = order.vendor.username;
                      acc[vendorName] = (acc[vendorName] || 0) + (order.price * order.quantity);
                      return acc;
                    }, {})
                  )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([name, revenue]) => (
                      <li key={name}>
                        <span>{name}</span>
                        <span>{formatCurrency(revenue)}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p>No vendor data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyPurchaseDetails; 