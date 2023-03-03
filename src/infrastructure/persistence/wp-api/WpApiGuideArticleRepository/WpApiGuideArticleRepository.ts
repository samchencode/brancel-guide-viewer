import type {
  Article,
  ArticleId,
  ArticleRepository,
} from '@/domain/models/Article';
import type { GuideParser } from '@/domain/models/Guide';
import { WpApiArticleNotFoundError } from '@/infrastructure/persistence/wp-api/WpApiArticleNotFoundError';
import { WpApiError } from '@/infrastructure/persistence/wp-api/WpApiError';
import type { WpApiErrorResponse } from '@/infrastructure/persistence/wp-api/WpApiErrorResponse';
import type { WpApiPageResponse } from '@/infrastructure/persistence/wp-api/WpApiPageResponse';

class WpApiGuideArticleRepository implements ArticleRepository {
  private articles: Promise<Article[]>;

  constructor(
    private guideParser: GuideParser,
    private fetch: (url: string) => Promise<Response>,
    private wpApiHostUrl: string,
    private wpApiPageId: string
  ) {
    this.articles = this.downloadAndParseAllArticles();
  }

  private async downloadAndParseAllArticles() {
    const url = `${this.wpApiHostUrl}/wp-json/wp/v2/pages/${this.wpApiPageId}`;
    const response = await this.fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new WpApiError(response.status, data as WpApiErrorResponse);
    }
    const html = (data as WpApiPageResponse).content.rendered;
    return this.guideParser.getArticles(html);
  }

  async getAll(): Promise<Article[]> {
    return this.articles;
  }

  async getById(id: ArticleId): Promise<Article> {
    const articles = await this.articles;
    const result = articles.find((a) => a.id.is(id));
    if (!result) throw new WpApiArticleNotFoundError(id);
    return result;
  }
}

export { WpApiGuideArticleRepository };
