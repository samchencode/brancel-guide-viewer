import {
  About,
  ArticleId,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { FakeGuideRepository } from '@/infrastructure/persistence/fake/FakeGuideRepository';
import { GuideArticleRepository } from '@/infrastructure/persistence/guide/GuideArticleRepository';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

const parser = new CheerioGuideParser(sanitizeHtml);
const guideRepo = new FakeGuideRepository(parser);

describe('GuideArticleRepository', () => {
  describe('Instantiation', () => {
    it('should be created with a guide repo', () => {
      const create = () => new GuideArticleRepository(guideRepo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: GuideArticleRepository;

    beforeEach(() => {
      repo = new GuideArticleRepository(guideRepo);
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

    it('should get article by section id within article', async () => {
      const article = await repo.getBySectionId('ulna_shaft_fracture');
      expect(article.title).toBe('Upper-extremity fractures');
      expect(article.body.html).toMatchSnapshot();
    });

    it('should get about section', async () => {
      const about = await repo.getAbout();
      expect(about.id.toString()).toBe(About.ABOUT_ID);
      expect(about.title).toBe(About.ABOUT_TITLE);
      expect(about.body.html).toMatchSnapshot();
    });

    it('should get index section', async () => {
      const index = await repo.getIndex();
      expect(index.id.toString()).toBe(Index.INDEX_ID);
      expect(index.title).toBe(Index.INDEX_TITLE);
      expect(index.body.html).toMatchSnapshot();
    });

    it('should get usage instructions section', async () => {
      const instructions = await repo.getUsageInstructions();
      expect(instructions.id.toString()).toBe(
        UsageInstructions.USAGE_INSTRUCTIONS_ID
      );
      expect(instructions.title).toBe(
        UsageInstructions.USAGE_INSTRUCTIONS_TITLE
      );
      expect(instructions.body.html).toMatchSnapshot();
    });
  });
});
