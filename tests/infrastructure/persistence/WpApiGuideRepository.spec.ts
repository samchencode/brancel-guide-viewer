import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { WpApiGuideRepository } from '@/infrastructure/persistence/wp-api/WpApiGuideRepository';
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

    it('should get the last updated date', async () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const repo = new WpApiGuideRepository(fetch, host, pageId, parser);
      const date = await repo.getLastUpdatedTimestamp();

      const expected = new Date('2023-02-18T23:43:09Z');
      expect(date.getTime()).toBe(expected.getTime());
    });
  });
});
