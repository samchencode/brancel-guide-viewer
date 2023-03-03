import type { WpApiErrorResponse } from '@/infrastructure/persistence/wp-api/WpApiErrorResponse';

class WpApiError extends Error {
  readonly name = 'WpApiHttpError';

  constructor(status: number, { code, message }: WpApiErrorResponse) {
    super(`${status} ${message} - (${code})`);
  }
}

export { WpApiError };
