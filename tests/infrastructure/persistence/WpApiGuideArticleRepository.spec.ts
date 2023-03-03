import { ArticleId } from '@/domain/models/Article';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { WpApiGuideArticleRepository } from '@/infrastructure/persistence/wp-api/WpApiGuideArticleRepository/WpApiGuideArticleRepository';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';
import { stubApiResponse } from './stubApiResponse';

describe('WpApiGuideArticleRepository', () => {
  const fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(stubApiResponse),
  });

  describe('Instantiation', () => {
    it('should be created with host and page id', () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const create = () =>
        new WpApiGuideArticleRepository(parser, fetch, host, pageId);

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: WpApiGuideArticleRepository;

    beforeEach(() => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      repo = new WpApiGuideArticleRepository(parser, fetch, host, pageId);
    });

    it('should get and parse all articles', async () => {
      const articles = await repo.getAll();
      expect(articles).toHaveLength(11);
    });

    it('should get article by id', async () => {
      const article = await repo.getById(
        new ArticleId('CERVICAL_SPINE_INJURIES')
      );
      expect(article.title).toBe('Cervical spine injuries');
    });
  });
});
