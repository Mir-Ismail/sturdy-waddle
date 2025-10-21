import React from "react";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-container"
          >
            <div className="error-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            <div className="error-actions">
              <button onClick={this.handleReset} className="btn btn-primary">
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </motion.div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .error-container {
              background: white;
              border-radius: 12px;
              padding: 3rem;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              width: 100%;
            }

            .error-icon {
              color: #e53e3e;
              margin-bottom: 1.5rem;
            }

            .error-title {
              font-size: 1.5rem;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 1rem;
            }

            .error-message {
              color: #718096;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-bottom: 2rem;
            }

            .btn {
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }

            .btn-primary {
              background: #4299e1;
              color: white;
            }

            .btn-primary:hover {
              background: #3182ce;
            }

            .btn-secondary {
              background: #e2e8f0;
              color: #4a5568;
            }

            .btn-secondary:hover {
              background: #cbd5e0;
            }

            .error-details {
              margin-top: 2rem;
              text-align: left;
              background: #f7fafc;
              border-radius: 8px;
              padding: 1rem;
            }

            .error-details summary {
              cursor: pointer;
              font-weight: 500;
              color: #4a5568;
              margin-bottom: 0.5rem;
            }

            .error-stack {
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 0.875rem;
              color: #e53e3e;
              white-space: pre-wrap;
              word-break: break-all;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
