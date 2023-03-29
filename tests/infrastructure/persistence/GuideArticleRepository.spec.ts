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

const parser = new CheerioGuideParser();
const guideRepo = new FakeGuideRepository(parser);

describe('GuideArticleRepository', () => {
  describe('Instantiation', () => {
    it('should be created with a guide repo', () => {
      const create = () => new GuideArticleRepository(guideRepo, sanitizeHtml);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: GuideArticleRepository;

    beforeEach(() => {
      repo = new GuideArticleRepository(guideRepo, sanitizeHtml);
    });

    it('should get and parse all articles', async () => {
      const articles = await repo.getAll();
      expect(articles).toHaveLength(14);
    });

    it('should get all articles including about, usage instructions, and index', async () => {
      const articles = await repo.getAll();
      const about = articles.find((a) =>
        a.id.is(new ArticleId(About.ABOUT_ID))
      );
      expect(about).toBeDefined();
      const instructions = articles.find((a) =>
        a.id.is(new ArticleId(UsageInstructions.USAGE_INSTRUCTIONS_ID))
      );
      expect(instructions).toBeDefined();
      const index = articles.find((a) =>
        a.id.is(new ArticleId(Index.INDEX_ID))
      );
      expect(index).toBeDefined();
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

    it('should get index by section id within index', async () => {
      const index = await repo.getBySectionId('A');
      expect(index.title).toBe(Index.INDEX_TITLE);
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
