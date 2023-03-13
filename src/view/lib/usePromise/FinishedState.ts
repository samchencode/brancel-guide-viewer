import type { State } from '@/view/lib/usePromise/State';

type FinishedStateParams<T> = {
  renderElement: (res: T) => JSX.Element;
  result: T;
};

export class FinishedState<T> implements State {
  private readonly renderElement: (res: T) => JSX.Element;

  private readonly result: T;

  constructor({ renderElement, result }: FinishedStateParams<T>) {
    this.renderElement = renderElement;
    this.result = result;
  }

  render() {
    return this.renderElement(this.result);
  }
}
