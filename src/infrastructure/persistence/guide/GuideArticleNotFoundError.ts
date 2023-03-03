import type { ArticleId } from '@/domain/models/Article';

class GuideArticleNotFoundError extends Error {
  name = 'WpApiArticleNotFoundError';

  constructor(id: ArticleId) {
    super(`No article with id of ${id} was found!`);
  }
}
export { GuideArticleNotFoundError };
