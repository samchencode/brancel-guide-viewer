import type { ArticleRepository } from '@/domain/models/Article';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { LunrArticleSearch } from '@/infrastructure/search/lunr/LunrArticleSearch';

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
      repo = new FakeArticleRepository();
    });

    it('should get articles matching search term without html tags', async () => {
      const lunrSearch = new LunrArticleSearch(repo);

      const results = await lunrSearch.search('Hai My Article');
      const result = results[0];
      expect(result).toBeDefined();
      expect(result.article.body).not.toContain('<img');
      expect(results).toMatchSnapshot();
    });
  });
});
