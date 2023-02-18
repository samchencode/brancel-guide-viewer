import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText/RichText';

describe('Article', () => {
  describe('Instantiation', () => {
    it('should be created with id, title, RichText body', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');

      const create = () => new Article(id, title, body);
      expect(create).not.toThrowError();
    });

    it('should be created with id, title, RichText body, and a list of section ids', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');
      const sectionIds = ['important-id'];

      const create = () => new Article(id, title, body, sectionIds);
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

    it('should contain section ids it was given', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');
      const sectionIds = ['important-id'];

      const article = new Article(id, title, body, sectionIds);

      expect(article.hasSection('important-id')).toBe(true);
      expect(article.hasSection('unimportant-id')).toBe(false);
    });

    it('should add id string to list of section ids', () => {
      const id = new ArticleId('my-article');
      const title = 'Example Article';
      const body = new RichText(jest.fn(), 'Article Body');

      const article = new Article(id, title, body);

      expect(article.hasSection('my-article')).toBe(true);
    });
  });
});
