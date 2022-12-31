import type { ArticleRepository } from '@/domain/models/Article';

class GetAllArticlesAction {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute() {
    return this.articleRepository.getAll();
  }
}

export { GetAllArticlesAction };
