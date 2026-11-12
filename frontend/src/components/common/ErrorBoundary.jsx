// components/common/ErrorBoundary.jsx
import React from 'react';
import ErrorPage from '../../pages/ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorType: null };
  }

  static getDerivedStateFromError(error) {
    // Agli render mein fallback UI dikhane ke liye state update karein
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Crash Caught:", error, errorInfo);
    // Yahan aap error logging service (like Sentry) ko bhej sakte hain
  }

  render() {
    if (this.state.hasError) {
      // Aapka Custom Error Page yahan aayega
      return <ErrorPage type="crash" reset={() => window.location.href = '/'} />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;