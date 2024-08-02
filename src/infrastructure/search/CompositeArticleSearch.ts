import type {
  ArticleRepository,
  ArticleSearch,
  ArticleSearchResult,
} from '@/domain/models/Article';
import { FuseArticleSearch } from '@/infrastructure/search/fuze/FuseArticleSearch';
import { LunrArticleSearch } from '@/infrastructure/search/lunr/LunrArticleSearch';

class CompositeArticleSearch implements ArticleSearch {
  private lunrArticleSearch: LunrArticleSearch;

  private fuseArticleSearch: FuseArticleSearch;

  constructor(articleRepository: ArticleRepository) {
    this.lunrArticleSearch = new LunrArticleSearch(articleRepository);
    this.fuseArticleSearch = new FuseArticleSearch(articleRepository);
  }

  async search(searchText: string): Promise<ArticleSearchResult[]> {
    const lunrResults = await this.lunrArticleSearch.search(searchText);
    if (lunrResults.length !== 0) return lunrResults;
    const fuseResults = await this.fuseArticleSearch.search(searchText);
    return fuseResults;
  }

  static $inject = ['articleRepository'];
}

export { CompositeArticleSearch };
