import type {
  ArticleSearch,
  ArticleSearchResult,
} from '@/domain/models/Article';

class SearchArticlesAction {
  constructor(private articleSearch: ArticleSearch) {}

  async execute(searchText: string): Promise<ArticleSearchResult[]> {
    return this.articleSearch.search(searchText);
  }

  static $inject = ['articleSearch'];
}

export { SearchArticlesAction };
