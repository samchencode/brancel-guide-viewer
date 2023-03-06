import { Article, ArticleId } from '@/domain/models/Article';
import type {
  ArticleRepository,
  About,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import type { FakeArticle } from '@/infrastructure/persistence/fake/fakeArticles';
import { fakeArticles } from '@/infrastructure/persistence/fake/fakeArticles';
import { RichText } from '@/domain/models/RichText/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

class FakeArticleRepository implements ArticleRepository {
  fakeArticles = fakeArticles.slice();

  async getAll(): Promise<Article[]> {
    return this.fakeArticles.map(this.makeArticle);
  }

  async getById(id: ArticleId): Promise<Article> {
    const article = this.fakeArticles.find((a) => a.id === id.toString());
    if (!article) throw Error(`Article with id of [${id}] not found`);
    return this.makeArticle(article);
  }

  async getBySectionId(): Promise<Article> {
    throw new Error('Method Not Implemented');
  }

  getAbout(): Promise<About> {
    throw new Error('Method not implemented.');
  }

  getIndex(): Promise<Index> {
    throw new Error('Method not implemented.');
  }

  getUsageInstructions(): Promise<UsageInstructions> {
    throw new Error('Method not implemented.');
  }

  private makeArticle(a: FakeArticle) {
    return new Article(
      new ArticleId(a.id),
      a.title,
      new RichText(sanitizeHtml, a.body)
    );
  }
}

export { FakeArticleRepository };
