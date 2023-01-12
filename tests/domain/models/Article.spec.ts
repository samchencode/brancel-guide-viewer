import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';

describe('Article', () => {
  describe('Instantiation', () => {
    it('should be created with id, title, RichText body', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');

      const create = () => new Article(id, title, body);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should allow retrieval of id, title, and body', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');

      const article = new Article(id, title, body);

      expect(article.id.is(id)).toBe(true);
      expect(article.title).toBe('Example Article');
      expect(article.body.html).toBe('Article Body');
    });
  });
});
