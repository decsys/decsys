import { Location } from "@reach/router";
import React, { cloneElement } from "react";
import { isEqual } from "lodash-es";

// Error boundaries currently have to be classes.

/**
 * An Error boundary not dependent on any context,
 * which can safely be used at the top level of the component tree
 */
class NakedErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Default ErrorBoundary, requires certain Contexts available to work as intended.
 * Notably, Auth and Location.
 */
class DefaultErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetOnPropChanges && !isEqual(prevProps, this.props)) {
      this.setState({
        hasError: false,
      });
    }
    if (prevProps.location.key !== this.props.location.key) {
      this.setState({
        hasError: false,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return cloneElement(this.props.fallback, {
        __BoundaryError: this.state.error,
      });
    }
    return this.props.children;
  }
}

/**
 * Default ErrorBoundary, requires certain Contexts available to work as intended.
 * Notably, Auth and Location.
 */
class ErrorBoundary extends React.Component {
  render() {
    return (
      <Location>
        {({ location }) => (
          <DefaultErrorBoundary location={location} {...this.props} />
        )}
      </Location>
    );
  }
}

export { ErrorBoundary, NakedErrorBoundary };
