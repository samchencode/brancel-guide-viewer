import type {
  About,
  Article,
  ArticleId,
  ArticleRepository,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import type { Guide, GuideRepository } from '@/domain/models/Guide';
import { GuideArticleNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleNotFoundError';
import { GuideArticleSectionNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleSectionNotFoundError';

class GuideArticleRepository implements ArticleRepository {
  guide: Promise<Guide>;

  constructor(private guideRepository: GuideRepository) {
    this.guide = this.guideRepository.get();
  }

  async getAbout(): Promise<About> {
    const guide = await this.guide;
    return guide.getAbout();
  }

  async getIndex(): Promise<Index> {
    const guide = await this.guide;
    return guide.getIndex();
  }

  async getUsageInstructions(): Promise<UsageInstructions> {
    const guide = await this.guide;
    return guide.getUsageInstructions();
  }

  async getAll(): Promise<Article[]> {
    const guide = await this.guide;
    return guide.getArticles();
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
