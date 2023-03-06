class WebViewError extends Error {
  readonly name = 'WebViewError';

  constructor(name: string, message: string) {
    super(`${name}: ${message}`);
  }
}

export { WebViewError };
