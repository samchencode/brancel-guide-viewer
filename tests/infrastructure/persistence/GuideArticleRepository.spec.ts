import { ArticleId } from '@/domain/models/Article';
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
    });
  });
});
