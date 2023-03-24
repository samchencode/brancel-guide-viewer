import { getImageUrisFromHtml } from '@/infrastructure/html-manipulation/cheerio/getImageUrisFromHtml';
import { replaceImageUrisInHtml } from '@/infrastructure/html-manipulation/cheerio/replaceImageUrisInHtml';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { WpApiGuideRepository } from '@/infrastructure/persistence/wp-api/WpApiGuideRepository';
import { cheerio } from '@/vendor/cheerio';
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
        new WpApiGuideRepository(
          fetch,
          host,
          pageId,
          parser,
          getImageUrisFromHtml,
          replaceImageUrisInHtml
        );

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get guide from wp api response', async () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const repo = new WpApiGuideRepository(
        fetch,
        host,
        pageId,
        parser,
        getImageUrisFromHtml,
        replaceImageUrisInHtml
      );
      const guide = await repo.get();
      expect(guide.html).toMatchSnapshot();
    });

    it('should get the last updated date', async () => {
      const host = 'https://wordpress.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);
      const repo = new WpApiGuideRepository(
        fetch,
        host,
        pageId,
        parser,
        getImageUrisFromHtml,
        replaceImageUrisInHtml
      );
      const date = await repo.getLastUpdatedTimestamp();

      const expected = new Date('2023-02-18T23:43:09Z');
      expect(date.getTime()).toBe(expected.getTime());
    });

    it('should prepend image src with api host if not already present', async () => {
      const host = 'https://example.com';
      const pageId = '4321';
      const parser = new CheerioGuideParser(sanitizeHtml);

      const fetchWithImageInResult = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          content: {
            rendered: `<html><body>
              <img class="foo" src="foo.png">
              <img class="bar" src="/bar.png">
              <img class="baz" src="http://ex.com/baz.png">
            </body></html>
            `,
          },
        }),
      });

      const repo = new WpApiGuideRepository(
        fetchWithImageInResult,
        host,
        pageId,
        parser,
        getImageUrisFromHtml,
        replaceImageUrisInHtml
      );

      const guide = await repo.get();

      const $ = cheerio.load(guide.html);
      expect($.html()).toMatchSnapshot();
    });
  });
});
