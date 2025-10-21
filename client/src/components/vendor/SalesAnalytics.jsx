import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";
import "./SalesAnalytics.css";

const SalesAnalytics = React.forwardRef((props, ref) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  // Expose refresh function for parent component
  React.useImperativeHandle(ref, () => ({
    refresh: fetchAnalytics,
  }));

  const fetchAnalytics = async () => {
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
          errorData.message || `HTTP ${response.status}: analytics`
        );
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={fetchAnalytics} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <h3>No Analytics Data</h3>
        <p>No analytics data is available for this period.</p>
        <button onClick={fetchAnalytics} className="retry-btn">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="sales-analytics">
      <div className="analytics-header">
        <h2>Sales Analytics</h2>
        <div className="period-selector">
          <label>Time Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="card-icon">
            <FiDollarSign />
          </div>
          <div className="card-content">
            <h3>Total Sales</h3>
            <p className="card-value">{formatCurrency(analytics.totalSales)}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FiShoppingCart />
          </div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p className="card-value">{analytics.totalOrders}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FiPackage />
          </div>
          <div className="card-content">
            <h3>Items Sold</h3>
            <p className="card-value">{analytics.totalItems}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FiTrendingUp />
          </div>
          <div className="card-content">
            <h3>Average Order Value</h3>
            <p className="card-value">
              {analytics.totalOrders > 0
                ? formatCurrency(analytics.totalSales / analytics.totalOrders)
                : formatCurrency(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="product-performance">
        <h3>Product Performance</h3>
        {analytics.productSales.length === 0 ? (
          <div className="empty-state">
            <p>No sales data for this period</p>
          </div>
        ) : (
          <div className="product-sales-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {analytics.productSales.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                    <td>
                      {analytics.totalSales > 0
                        ? `${(
                            (product.revenue / analytics.totalSales) *
                            100
                          ).toFixed(1)}%`
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sales Chart */}
      <div className="sales-chart">
        <h3>Sales Trend</h3>
        {analytics.salesTrend && analytics.salesTrend.length > 0 ? (
          <TrendChart data={analytics.salesTrend} />
        ) : (
          <div className="chart-placeholder">
            <FiTrendingUp size={48} />
            <p>No sales trend data for this period</p>
            <p>Period: {period}</p>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="analytics-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Best Performing Product</h4>
            <p>
              {analytics.productSales.length > 0
                ? analytics.productSales.reduce((best, current) =>
                    current.revenue > best.revenue ? current : best
                  ).name
                : "No data available"}
            </p>
          </div>

          <div className="insight-card">
            <h4>Sales Efficiency</h4>
            <p>
              {analytics.totalOrders > 0
                ? `${
                    analytics.totalItems / analytics.totalOrders
                  } items per order`
                : "No orders yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

// Lightweight SVG line chart component (no external deps)
const TrendChart = ({ data }) => {
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const parseDate = (d) => new Date(d);
  const points = data
    .map((d) => ({ date: parseDate(d.date), sales: Number(d.sales || 0) }))
    .sort((a, b) => a.date - b.date);

  if (points.length === 0) return null;

  const minX = points[0].date.getTime();
  const maxX = points[points.length - 1].date.getTime();
  const minY = 0;
  const maxY = Math.max(...points.map((p) => p.sales)) || 1;

  const xScale = (t) =>
    padding.left + ((t - minX) / (maxX - minX || 1)) * innerW;
  const yScale = (v) =>
    padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  const pathD = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.date.getTime())} ${yScale(p.sales)}`
    )
    .join(" ");

  // X axis ticks: first, middle, last
  const xTicks = [
    points[0],
    points[Math.floor(points.length / 2)],
    points[points.length - 1],
  ].filter(Boolean);

  // Y axis ticks: 0, mid, max
  const yTicks = [0, Math.round(maxY / 2), maxY];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sales Trend">
      {/* Axes */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
      />
      <line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
        stroke="#e5e7eb"
      />

      {/* Gridlines and Y labels */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={yScale(v)}
            x2={width - padding.right}
            y2={yScale(v)}
            stroke="#f3f4f6"
          />
          <text
            x={padding.left - 8}
            y={yScale(v)}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#64748b"
            fontSize="10"
          >
            {new Intl.NumberFormat("en-PK", {
              maximumFractionDigits: 0,
            }).format(v)}
          </text>
        </g>
      ))}

      {/* Path */}
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" />

      {/* Points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={xScale(p.date.getTime())}
          cy={yScale(p.sales)}
          r="3"
          fill="#2563eb"
        />
      ))}

      {/* X labels */}
      {xTicks.map((p, i) => (
        <text
          key={i}
          x={xScale(p.date.getTime())}
          y={height - padding.bottom + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize="10"
        >
          {p.date.toLocaleDateString()}
        </text>
      ))}
    </svg>
  );
};

export default SalesAnalytics;
