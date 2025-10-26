import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import PropTypes from "prop-types";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";
import "./SalesAnalytics.css";

const SalesAnalytics = forwardRef((props, ref) => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("month");

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/api/vendor/analytics?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to fetch analytics`
        );
      }

      const data = await response.json();
      console.log("Analytics data received:", data);
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Fetch on mount and when period changes
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Expose refresh function for parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchAnalytics,
  }));

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-PK").format(num || 0);
  };

  // Set default values to prevent undefined errors
  const analyticsData = {
    totalSales: analytics.totalSales || 0,
    totalOrders: analytics.totalOrders || 0,
    totalItems: analytics.totalItems || 0,
    productSales: analytics.productSales || [],
    salesTrend: analytics.salesTrend || [],
    period: analytics.period || period,
  };

  // Loading state
  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="analytics-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={fetchAnalytics} className="retry-btn">
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  // Main Analytics UI
  return (
    <div className="sales-analytics">
      {/* Header with Period Selector */}
      <div className="analytics-header">
        <div className="header-left">
          <h2>
            <FiBarChart2 /> Sales Analytics
          </h2>
          <p className="header-subtitle">
            Track your business performance and sales metrics
          </p>
        </div>
        <div className="period-selector">
          <label htmlFor="period-select">Time Period:</label>
          <select
            id="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="hour">Last Hour</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card sales-card">
          <div className="card-icon">
            <FiDollarSign />
          </div>
          <div className="card-content">
            <h3>Total Sales</h3>
            <p className="card-value">{formatCurrency(analyticsData.totalSales)}</p>
            <span className="card-period">{analyticsData.period}</span>
          </div>
        </div>

        <div className="summary-card orders-card">
          <div className="card-icon">
            <FiShoppingCart />
          </div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p className="card-value">{formatNumber(analyticsData.totalOrders)}</p>
            <span className="card-period">{analyticsData.period}</span>
          </div>
        </div>

        <div className="summary-card items-card">
          <div className="card-icon">
            <FiPackage />
          </div>
          <div className="card-content">
            <h3>Items Sold</h3>
            <p className="card-value">{formatNumber(analyticsData.totalItems)}</p>
            <span className="card-period">{analyticsData.period}</span>
          </div>
        </div>

        <div className="summary-card avg-card">
          <div className="card-icon">
            <FiTrendingUp />
          </div>
          <div className="card-content">
            <h3>Average Order</h3>
            <p className="card-value">
              {analyticsData.totalOrders > 0
                ? formatCurrency(analyticsData.totalSales / analyticsData.totalOrders)
                : formatCurrency(0)}
            </p>
            <span className="card-period">per order</span>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="sales-chart-section">
        <div className="section-header">
          <h3>
            <FiTrendingUp /> Sales Trend
          </h3>
          <span className="chart-period">{period}</span>
        </div>
        {analyticsData.salesTrend && analyticsData.salesTrend.length > 0 ? (
          <TrendChart data={analyticsData.salesTrend} />
        ) : (
          <div className="chart-placeholder">
            <FiBarChart2 size={48} />
            <p>No sales trend data for this period</p>
            <p className="placeholder-subtitle">Start making sales to see your trend</p>
          </div>
        )}
      </div>

      {/* Product Performance */}
      <div className="product-performance-section">
        <div className="section-header">
          <h3>
            <FiPackage /> Product Performance
          </h3>
          <span className="products-count">
            {analyticsData.productSales.length} products sold
          </span>
        </div>
        {analyticsData.productSales.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={48} />
            <p>No sales data for this period</p>
            <p className="empty-subtitle">Your product sales will appear here</p>
          </div>
        ) : (
          <div className="product-sales-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.productSales.map((product, index) => (
                  <tr key={index}>
                    <td className="product-name">{product.name}</td>
                    <td>{formatNumber(product.quantity)}</td>
                    <td className="revenue-cell">{formatCurrency(product.revenue)}</td>
                    <td>
                      <div className="percentage-bar">
                        <div
                          className="percentage-fill"
                          style={{
                            width: `${analyticsData.totalSales > 0
                              ? (product.revenue / analyticsData.totalSales) * 100
                              : 0
                              }%`,
                          }}
                        ></div>
                        <span className="percentage-text">
                          {analyticsData.totalSales > 0
                            ? `${((product.revenue / analyticsData.totalSales) * 100).toFixed(1)}%`
                            : "0%"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="analytics-insights-section">
        <div className="section-header">
          <h3>
            <FiTrendingUp /> Key Insights
          </h3>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">
              <FiTrendingUp />
            </div>
            <h4>Best Performing Product</h4>
            <p className="insight-value">
              {analyticsData.productSales.length > 0
                ? analyticsData.productSales.reduce((best, current) =>
                  current.revenue > best.revenue ? current : best
                ).name
                : "No data"}
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <FiUsers />
            </div>
            <h4>Sales Efficiency</h4>
            <p className="insight-value">
              {analyticsData.totalOrders > 0
                ? `${(analyticsData.totalItems / analyticsData.totalOrders).toFixed(1)} items per order`
                : "No orders yet"}
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">
              <FiBarChart2 />
            </div>
            <h4>Total Revenue</h4>
            <p className="insight-value">
              {formatCurrency(analyticsData.totalSales)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

// Lightweight SVG Chart Component
const TrendChart = ({ data }) => {
  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const points = (Array.isArray(data) ? data : [])
    .map((d) => ({ date: parseDate(d.date), sales: Number(d.sales || 0) }))
    .sort((a, b) => a.date - b.date);

  if (points.length === 0) return null;

  const minX = points[0].date.getTime();
  const maxX = points[points.length - 1].date.getTime();
  const minY = 0;
  const maxY = Math.max(...points.map((p) => p.sales), 1);

  const xScale = (time) =>
    padding.left + ((time - minX) / (maxX - minX || 1)) * innerW;
  const yScale = (value) =>
    padding.top + innerH - ((value - minY) / (maxY - minY || 1)) * innerH;

  const pathD = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.date.getTime())} ${yScale(p.sales)}`
    )
    .join(" ");

  const xTicks = [
    points[0],
    points[Math.floor(points.length / 2)],
    points[points.length - 1],
  ].filter(Boolean);

  const yTicks = [0, Math.round(maxY / 2), Math.round(maxY)];

  return (
    <div className="chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart">
        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <line
            key={`grid-${i}`}
            x1={padding.left}
            y1={yScale(v)}
            x2={width - padding.right}
            y2={yScale(v)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {yTicks.map((v, i) => (
          <text
            key={`ylabel-${i}`}
            x={padding.left - 10}
            y={yScale(v)}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#6b7280"
            fontSize="12"
          >
            {new Intl.NumberFormat("en", {
              notation: "compact",
              compactDisplay: "short",
            }).format(v)}
          </text>
        ))}

        {/* Sales line */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={xScale(p.date.getTime())}
            cy={yScale(p.sales)}
            r="5"
            fill="#3b82f6"
          />
        ))}

        {/* X-axis labels */}
        {xTicks.map((p, i) => (
          <text
            key={`xlabel-${i}`}
            x={xScale(p.date.getTime())}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="11"
          >
            {p.date.toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
            })}
          </text>
        ))}
      </svg>
    </div>
  );
};

TrendChart.propTypes = {
  data: PropTypes.array.isRequired,
};

SalesAnalytics.displayName = "SalesAnalytics";

export default SalesAnalytics;
