import type { ArticleId } from '@/domain/models/Article';

class ArticleNotFoundError extends Error {
  name = 'ArticleNotFoundError';

  constructor(id: ArticleId) {
    super(`No article with id of ${id} was found!`);
  }
}
export { ArticleNotFoundError };
