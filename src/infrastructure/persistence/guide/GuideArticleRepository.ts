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
  guidePromise?: Promise<Guide>;

  constructor(
    private guideRepository: GuideRepository,
    private sanitizeHtml: SanitizeHtml
  ) {}

  private async getGuide() {
    if (this.guidePromise) return this.guidePromise;
    this.guidePromise = this.guideRepository.get();
    return this.guidePromise;
  }

  async getAbout(): Promise<About> {
    const guide = await this.getGuide();
    return guide.getAbout();
  }

  async getIndex(): Promise<Index> {
    const guide = await this.getGuide();
    return guide.getIndex();
  }

  async getUsageInstructions(): Promise<UsageInstructions> {
    const guide = await this.getGuide();
    return guide.getUsageInstructions();
  }

  // IDEA: could actually just setImmediate here...
  async getAll(): Promise<Article[]> {
    const guide = await this.getGuide();
    const normalArticles = await guide.getArticles();
    const index = await guide.getIndex();
    const instructions = await guide.getUsageInstructions();
    const about = await guide.getAbout();
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
      body: this.sanitizeHtml(a.body.html).trim(),
    }));
  }
}

export { GuideArticleRepository };
