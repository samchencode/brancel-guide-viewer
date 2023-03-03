import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { WpApiGuideRepository } from '@/infrastructure/persistence/wp-api/WpApiGuideArticleRepository/WpApiGuideRepository';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';
import { stubApiResponse } from './stubApiResponse';

const fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: jest.fn().mockResolvedValue(stubApiResponse),
});

describe('WpApiGuideRepository', () => {
  describe('Instantiation', () => {
    it('should be created with guide parser', () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const create = () =>
        new WpApiGuideRepository(fetch, host, pageId, parser);

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get guide from wp api response', async () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const repo = new WpApiGuideRepository(fetch, host, pageId, parser);
      const guide = await repo.get();
      expect(guide.html).toMatchSnapshot();
    });
  });
});
