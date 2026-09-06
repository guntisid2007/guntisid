import { Component } from "react";

// A failed optional 3D chunk must never take down the portfolio.
export default class ModelBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
