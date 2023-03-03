import type {
  Article,
  ArticleId,
  ArticleRepository,
} from '@/domain/models/Article';
import type { Guide, GuideRepository } from '@/domain/models/Guide';
import { GuideArticleNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleNotFoundError';

class GuideArticleRepository implements ArticleRepository {
  guide?: Guide;

  constructor(private guideRepository: GuideRepository) {}

  async getAll(): Promise<Article[]> {
    if (!this.guide) {
      this.guide = await this.guideRepository.get();
    }
    return this.guide.getArticles();
  }

  async getById(id: ArticleId): Promise<Article> {
    const articles = await this.getAll();
    const article = articles.find((a) => a.id.is(id));
    if (!article) throw new GuideArticleNotFoundError(id);
    return article;
  }
}

export { GuideArticleRepository };
