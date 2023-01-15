import type { Article } from '@/domain/models/Article/Article';

interface ArticleCache {
  // cacheExists?
  // cacheOutdated?
  getAllArticles(): Promise<Article[]>;
  saveArticles(articles: Article[]): Promise<void>;
}

export type { ArticleCache };
