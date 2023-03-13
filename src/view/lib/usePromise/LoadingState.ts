import type { Context } from '@/view/lib/usePromise/Context';
import type { State } from '@/view/lib/usePromise/State';

type LoadingStateParams<T> = {
  renderElement: () => JSX.Element;
  ctx: Context<T>;
  promise: Promise<T>;
};

class LoadingState<T> implements State {
  private readonly renderElement: () => JSX.Element;

  private readonly ctx: Context<T>;

  constructor({ renderElement, ctx, promise }: LoadingStateParams<T>) {
    this.renderElement = renderElement;
    this.ctx = ctx;
    promise
      .then((res) => this.finish(res))
      .catch((err) => this.throwError(err));
  }

  render() {
    return this.renderElement();
  }

  finish(res: T) {
    this.ctx.finish(res);
  }

  throwError(err: Error) {
    this.ctx.throwError(err);
  }
}

export { LoadingState };
