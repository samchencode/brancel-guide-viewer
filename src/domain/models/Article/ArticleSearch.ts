import type { ArticleSearchResult } from '@/domain/models/Article/ArticleSearchResult';

interface ArticleSearch {
  search(searchText: string): Promise<ArticleSearchResult[]>;
}

export type { ArticleSearch };
