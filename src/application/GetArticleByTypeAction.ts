import type { ArticleRepository } from '@/domain/models/Article';
import { ARTICLE_TYPES } from '@/domain/models/Article';

type ArticleType =
  | typeof ARTICLE_TYPES.ABOUT
  | typeof ARTICLE_TYPES.INDEX
  | typeof ARTICLE_TYPES.USAGE_INSTRUCTIONS;

class GetArticleByTypeAction {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(type: ArticleType) {
    switch (type) {
      case ARTICLE_TYPES.ABOUT:
        return this.articleRepository.getAbout();
      case ARTICLE_TYPES.INDEX:
        return this.articleRepository.getIndex();
      case ARTICLE_TYPES.USAGE_INSTRUCTIONS:
        return this.articleRepository.getUsageInstructions();
      default:
        throw Error(`Unknown article type: ${type}`);
    }
  }
}

export { GetArticleByTypeAction };
