import { GuideTableOfContentsRepository } from '@/infrastructure/persistence/guide/GuideTableOfContentsRepository';
import { FakeGuideRepository } from '@/infrastructure/persistence/fake/FakeGuideRepository';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';

describe('GuideTableOfContentsRepository', () => {
  describe('Instantiation', () => {
    it('should be reated with a guide repo', () => {
      const parser = new CheerioGuideParser();
      const guideRepo = new FakeGuideRepository(parser);
      const create = () => new GuideTableOfContentsRepository(guideRepo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get table of contents', async () => {
      const parser = new CheerioGuideParser();
      const guideRepo = new FakeGuideRepository(parser);
      const repository = new GuideTableOfContentsRepository(guideRepo);
      const tableOfContents = await repository.get();
      expect(tableOfContents.items).toHaveLength(11);
    });
  });
});
