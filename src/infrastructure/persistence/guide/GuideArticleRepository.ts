import type {
  Article,
  ArticleId,
  ArticleRepository,
} from '@/domain/models/Article';
import type { Guide, GuideRepository } from '@/domain/models/Guide';
import { GuideArticleNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleNotFoundError';
import { GuideArticleSectionNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleSectionNotFoundError';

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

  async getBySectionId(sectionId: string): Promise<Article> {
    const articles = await this.getAll();
    const article = articles.find((a) => a.hasSection(sectionId));
    if (!article) throw new GuideArticleSectionNotFoundError(sectionId);
    return article;
  }
}

export { GuideArticleRepository };
