import type { ARTICLE_TYPES } from '@/domain/models/Article/constants';

type ValueOf<T> = T[keyof T];

export type ArticleType = ValueOf<typeof ARTICLE_TYPES>;

export { About } from '@/domain/models/Article/About';
export { Index } from '@/domain/models/Article/Index_';
export { UsageInstructions } from '@/domain/models/Article/UsageInstructions';
export { Article } from '@/domain/models/Article/Article';
export { ArticleId } from '@/domain/models/Article/ArticleId';
export type { ArticleRepository } from '@/domain/models/Article/ArticleRepository';
export type { ArticleCache } from '@/domain/models/Article/ArticleCache';
export type { ArticleRenderer } from '@/domain/models/Article/ArticleRenderer';
export { ARTICLE_TYPES } from '@/domain/models/Article/constants';
export { SearchableArticle } from '@/domain/models/Article/SearchableArticle';
export {
  ArticleSearchResult,
  ArticleMatchData,
  StringSegment,
} from '@/domain/models/Article/ArticleSearchResult';
export { ArticleSearch } from '@/domain/models/Article/ArticleSearch';
