export function debounceFactory(ms: number) {
  let timeoutId: string | number | NodeJS.Timeout;
  let rejectPromise: (reason: string) => void = () => {};

  const REJECT_REASON = 'DEBOUNCE';

  return () =>
    new Promise((s, f) => {
      clearTimeout(timeoutId);
      rejectPromise(REJECT_REASON);
      timeoutId = setTimeout(s, ms);
      rejectPromise = f;
    }).catch((reason) => {
      if (reason !== REJECT_REASON) throw reason;
    });
}
