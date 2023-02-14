import type { ArticleId, ArticleRepository } from '@/domain/models/Article';

class GetArticleByIdAction {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: ArticleId) {
    return this.articleRepository.getById(id);
  }
}

export { GetArticleByIdAction };
