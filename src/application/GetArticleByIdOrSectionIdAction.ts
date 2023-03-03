import type { Article, ArticleRepository } from '@/domain/models/Article';
import { ArticleId } from '@/domain/models/Article';

class GetArticleByIdOrSectionIdAction {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article> {
    try {
      return await this.articleRepository.getById(new ArticleId(id));
    } catch (e) {
      return await this.articleRepository.getBySectionId(id);
    }
  }
}

export { GetArticleByIdOrSectionIdAction };
