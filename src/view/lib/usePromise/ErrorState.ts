import type { State } from '@/view/lib/usePromise/State';

type ErrorStateParams = {
  error: Error;
  renderElement?: (err: Error) => JSX.Element;
};

export class ErrorState implements State {
  private readonly error: Error;

  private readonly renderElement?: (err: Error) => JSX.Element;

  constructor({ error, renderElement }: ErrorStateParams) {
    this.error = error;
    this.renderElement = renderElement;
  }

  render() {
    return this.renderElement?.(this.error) ?? null;
  }
}
