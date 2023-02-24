import type { ArticleId } from '@/domain/models/Article';

class WpApiArticleNotFoundError extends Error {
  name = 'WpApiArticleNotFoundError';

  constructor(id: ArticleId) {
    super(`No article with id of ${id} was found!`);
  }
}
export { WpApiArticleNotFoundError };
