import { Context } from '@/view/lib/usePromise/Context';
import type { State } from '@/view/lib/usePromise/State';
import { useMemo, useState } from 'react';

type UsePromiseParams<T> = {
  renderLoadingState: () => JSX.Element;
  renderFinishedState: (res: T) => JSX.Element;
  renderErrorState?: (err: Error) => JSX.Element;
  onFinish?: (res: T) => void;
  onError?: (err: Error) => void;
};

function usePromise<T>(promise: Promise<T>, params: UsePromiseParams<T>) {
  const ctx: Context<T> = useMemo(
    () =>
      new Context<T>({
        promise,
        notify: (newState) => setState(newState),
        renderLoadingState: params.renderLoadingState,
        renderFinishedState: params.renderFinishedState,
        renderErrorState: params.renderErrorState,
        onFinish: params.onFinish,
        onError: params.onError,
      }),
    [
      params.renderLoadingState,
      params.renderFinishedState,
      params.renderErrorState,
      params.onFinish,
      params.onError,
      promise,
    ]
  );
  const initialState = useMemo(() => ctx.buildLoadingState(), [ctx]);
  const [state, setState] = useState<State>(initialState);

  return () => state.render();
}

export { usePromise };
