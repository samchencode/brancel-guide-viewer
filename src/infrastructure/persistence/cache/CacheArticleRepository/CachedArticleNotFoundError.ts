import type { ArticleId, ArticleType } from '@/domain/models/Article';

class CachedArticleNotFoundError extends Error {
  name = 'CachedArticleNotFoundError';

  constructor(info: ArticleId | ArticleType) {
    super();
    if (typeof info === 'string') {
      this.message = `Article of type ${info} was not found in the cache.`;
    } else {
      this.message = `Article with id of ${info} was not found in the cache.`;
    }
  }
}

export { CachedArticleNotFoundError };
