import type {
  About,
  Article,
  ArticleId,
  ArticleRepository,
  Index,
  SearchableArticle,
  UsageInstructions,
} from '@/domain/models/Article';
import type { Guide, GuideRepository } from '@/domain/models/Guide';
import type { SanitizeHtml } from '@/domain/models/RichText';
import { GuideArticleNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleNotFoundError';
import { GuideArticleSectionNotFoundError } from '@/infrastructure/persistence/guide/GuideArticleSectionNotFoundError';

class GuideArticleRepository implements ArticleRepository {
  guide: Promise<Guide>;

  constructor(
    private guideRepository: GuideRepository,
    private sanitizeHtml: SanitizeHtml
  ) {
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
    const normalArticles = guide.getArticles();
    const index = guide.getIndex();
    const instructions = guide.getUsageInstructions();
    const about = guide.getAbout();
    return [...normalArticles, index, instructions, about];
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

  async getLastUpdatedTimestamp(): Promise<Date> {
    return this.guideRepository.getLastUpdatedTimestamp();
  }

  async getAllSearchable(): Promise<SearchableArticle[]> {
    const articles = await this.getAll();
    return articles.map((a) => ({
      id: a.id.toString(),
      title: a.title,
      body: this.sanitizeHtml(a.body.html),
    }));
  }
}

export { GuideArticleRepository };
