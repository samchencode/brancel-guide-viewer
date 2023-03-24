import type { ArticleId, ArticleType } from '@/domain/models/Article';
import type { TableOfContents } from '@/domain/models/TableOfContents';
import type { ArticleToBeCached } from '@/infrastructure/persistence/cache/CacheArticleRepository/ArticleToBeCached';
import type { CachedArticle } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticle';

interface CacheRepository {
  getArticleById(id: ArticleId): Promise<CachedArticle>;
  getArticleBySectionId(sectionId: string): Promise<CachedArticle>;
  getArticleByType(type: ArticleType): Promise<CachedArticle>;
  saveAllArticles(
    articles: ArticleToBeCached[],
    lastUpdatedTimestamp: Date
  ): Promise<void>;
  isStale(receivedLastUpdatedTimestamp: Date): Promise<boolean>;
  isEmpty(): Promise<boolean>;
  updateCachedImagesJson(id: ArticleId, json: string): Promise<void>;
  getTableOfContents(): Promise<TableOfContents>;
  saveTableOfContents(tableOfContents: TableOfContents): Promise<void>;
  getLastUpdatedTimestamp(): Promise<Date>;
}

export type { CacheRepository };
