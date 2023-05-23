import { ErrorView } from '@/view/ErrorView/ErrorView';
import React, { Component } from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: unknown;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  renderErrorScreen(error: unknown) {
    return <ErrorView error={error} />;
  }

  render() {
    const { children } = this.props;
    const { error, hasError } = this.state;
    if (hasError) return this.renderErrorScreen(error);
    return children;
  }
}

export { ErrorBoundary };
