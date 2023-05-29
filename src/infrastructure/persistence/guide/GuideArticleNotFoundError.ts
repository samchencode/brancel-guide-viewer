import { ArticleNotFoundError } from '@/domain/models/Article';

class GuideArticleNotFoundError extends ArticleNotFoundError {
  name = 'WpApiArticleNotFoundError';
}

export { GuideArticleNotFoundError };
