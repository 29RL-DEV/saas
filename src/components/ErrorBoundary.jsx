import React from "react";

// #error_boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((state) => ({
      error,
      errorInfo,
      errorCount: state.errorCount + 1,
    }));

    // #log_error
    console.error("Error caught by boundary:", error, errorInfo);

    // #report
    if (window.reportError) {
      window.reportError({
        error: error.toString(),
        errorInfo,
        timestamp: new Date().toISOString(),
      });
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <h1 className="error-boundary-title">⚠️ Something went wrong</h1>

            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">
                  Error details
                </summary>
                <pre className="error-boundary-errortext">
                  {this.state.error && this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                onClick={this.resetError}
                className="error-boundary-button-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="error-boundary-button-secondary"
              >
                Go Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="error-boundary-warning">
                Multiple errors detected. Please{" "}
                <a href="/">refresh the page</a>.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
