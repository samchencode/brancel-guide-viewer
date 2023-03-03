import type {
  Article,
  ArticleId,
  ArticleRepository,
} from '@/domain/models/Article';
import type { SanitizeHtml } from '@/domain/models/RichText';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import type { GuideParser } from '@/domain/models/Guide';
import { stubGuide } from '@/infrastructure/persistence/fake/stubGuide';

class FakeGuideArticleRepository implements ArticleRepository {
  private articles: Article[];

  private guideParser: GuideParser;

  constructor(sanitizeHtml: SanitizeHtml) {
    this.guideParser = new CheerioGuideParser(sanitizeHtml);
    this.articles = this.guideParser.getArticles(stubGuide);
  }

  async getAll(): Promise<Article[]> {
    return this.articles;
  }

  async getById(id: ArticleId): Promise<Article> {
    const article = this.articles.find((a) => a.id.is(id));
    if (!article) throw Error(`article with id of ${id.toString()} not found!`);
    return article;
  }
}

export { FakeGuideArticleRepository };
