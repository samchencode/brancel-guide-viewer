import type { Article, ArticleRepository } from '@/domain/models/Article';

class GetArticleBySectionIdAction {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(sectionId: string): Promise<Article> {
    return this.articleRepository.getBySectionId(sectionId);
  }
}

export { GetArticleBySectionIdAction };
