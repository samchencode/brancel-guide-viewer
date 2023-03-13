import type { State } from '@/view/lib/usePromise/State';
import { ErrorState } from '@/view/lib/usePromise/ErrorState';
import { FinishedState } from '@/view/lib/usePromise/FinishedState';
import { LoadingState } from '@/view/lib/usePromise/LoadingState';

type ContextParams<T> = {
  promise: Promise<T>;
  renderLoadingState: () => JSX.Element;
  renderFinishedState: (res: T) => JSX.Element;
  renderErrorState?: (err: Error) => JSX.Element;
  onFinish?: (res: T) => void;
  onError?: (err: Error) => void;
  notify: (newState: State) => void;
};

class Context<T> {
  private readonly promise: Promise<T>;

  private readonly renderLoadingState: () => JSX.Element;

  private readonly renderFinishedState: (res: T) => JSX.Element;

  private readonly renderErrorState?: (err: Error) => JSX.Element;

  private readonly notify: (newState: State) => void;

  private readonly onFinish?: (res: T) => void;

  private readonly onError?: (err: Error) => void;

  constructor({
    promise,
    renderLoadingState,
    renderFinishedState,
    renderErrorState,
    onFinish,
    onError,
    notify,
  }: ContextParams<T>) {
    this.promise = promise;
    this.renderLoadingState = renderLoadingState;
    this.renderFinishedState = renderFinishedState;
    this.renderErrorState = renderErrorState;
    this.onFinish = onFinish;
    this.onError = onError;
    this.notify = notify;
  }

  buildLoadingState() {
    return new LoadingState<T>({
      promise: this.promise,
      renderElement: this.renderLoadingState,
      ctx: this,
    });
  }

  private buildFinishedState(result: T) {
    return new FinishedState<T>({
      renderElement: this.renderFinishedState,
      result,
    });
  }

  private buildErrorState(error: Error) {
    return new ErrorState({
      renderElement: this.renderErrorState,
      error,
    });
  }

  finish(res: T) {
    const newState = this.buildFinishedState(res);
    this.onFinish?.(res);
    this.notify(newState);
  }

  throwError(err: Error) {
    const newState = this.buildErrorState(err);
    this.onError?.(err);
    this.notify(newState);
  }
}

export { Context };
