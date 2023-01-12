import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { NodeFileSystem } from '@/infrastructure/file-system/node/NodeFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer/EjsArticleRenderer';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

describe('EjsArticleRenderer', () => {
  let fs: NodeFileSystem;
  beforeAll(() => {
    fs = new NodeFileSystem();
    jest.resetModules();
    jest.doMock(
      '@/infrastructure/rendering/ejs/EjsArticleRenderer/template.ejs',
      () => '@/infrastructure/rendering/ejs/EjsArticleRenderer/template.ejs'
    );
  });

  describe('Instantiation', () => {
    it('should create new renderer given fs', () => {
      const create = () => new EjsArticleRenderer(fs);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should render html in the body', async () => {
      const id = new ArticleId('example');
      const title = 'Example Title';
      const body = new RichText(sanitizeHtml, '<h1>Hello World</h1>');
      const article = new Article(id, title, body);

      const renderer = new EjsArticleRenderer(fs);
      const html = await renderer.render(article);

      expect(html).not.toBe('');
      expect(html).toContain('<h1>Hello World</h1>');
      expect(html).toMatchSnapshot();
    });

    it('should not render html in the title', async () => {
      const id = new ArticleId('example');
      const title = '<h1>Example Title</h1>';
      const body = new RichText(sanitizeHtml, '<h1>Hello World</h1>');
      const article = new Article(id, title, body);

      const renderer = new EjsArticleRenderer(fs);
      const html = await renderer.render(article);

      expect(html).not.toContain('<h1>Example Title</h1>');
    });
  });
});
