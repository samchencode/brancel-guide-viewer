import { ArticleSectionNotFoundError } from '@/domain/models/Article';

class GuideArticleSectionNotFoundError extends ArticleSectionNotFoundError {
  name = 'WpApiArticleNotFoundError';
}

export { GuideArticleSectionNotFoundError };
