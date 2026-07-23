import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ color: '#fff', padding: 40, backgroundColor: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ff5555' }}>Something went wrong.</h1>
          <p>The application crashed. Please check the browser console for more details.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 20, padding: 20, backgroundColor: '#222', borderRadius: 8 }}>
            <summary style={{ cursor: 'pointer', marginBottom: 10 }}>Show Error Details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
