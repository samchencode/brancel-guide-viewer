import type { ArticleRepository } from '@/domain/models/Article';
import { ArticleId } from '@/domain/models/Article';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { FakeGuideRepository } from '@/infrastructure/persistence/fake/FakeGuideRepository';
import { GuideArticleRepository } from '@/infrastructure/persistence/guide/GuideArticleRepository';
import { LunrArticleSearch } from '@/infrastructure/search/lunr/LunrArticleSearch';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

describe('LunrArticleSearch', () => {
  describe('Instantiation', () => {
    it('should be created with article repo', () => {
      const repo = new FakeArticleRepository();
      const create = () => new LunrArticleSearch(repo);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    let repo: ArticleRepository;

    beforeEach(() => {
      const parser = new CheerioGuideParser();
      const guideRepo = new FakeGuideRepository(parser);
      repo = new GuideArticleRepository(guideRepo, sanitizeHtml);
    });

    it('should get articles matching search term without html tags', async () => {
      const lunrSearch = new LunrArticleSearch(repo);

      const results = await lunrSearch.search('evaluating all injuries');
      const result = results[0];
      expect(result).toBeDefined();
      expect(result.article.body).not.toContain('<img');
      expect(results).toMatchSnapshot();
    });

    it('should find ranges within the SearchableArticle that correspond to the original article', async () => {
      const lunrSearch = new LunrArticleSearch(repo);

      const results = await lunrSearch.search('evaluating all injuries');
      const result = results[0];

      const matchingText = result
        .getBodySegments()
        .filter((s) => s.includesMatch)
        .map((s) => s.text);
      const expectedMatchingText = result.matchData.body.map((r) =>
        result.article.body.slice(r[0], r[1])
      );

      expect(matchingText).toEqual(
        expect.arrayContaining(expectedMatchingText)
      );

      const originalArticleId = new ArticleId(result.article.id);
      const originalArticle = await repo.getById(originalArticleId);
      const originalArticleBodySanitized = sanitizeHtml(
        originalArticle.body.html
      ).trim();

      const matchingTextFromOriginal = result.matchData.body.map((r) =>
        originalArticleBodySanitized.slice(r[0], r[1])
      );

      expect(matchingTextFromOriginal).toEqual(
        expect.arrayContaining(matchingText)
      );
    });
  });
});
