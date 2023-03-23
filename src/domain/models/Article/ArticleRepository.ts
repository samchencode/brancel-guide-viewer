import type { About } from '@/domain/models/Article/About';
import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { Index } from '@/domain/models/Article/Index_';
import type { UsageInstructions } from '@/domain/models/Article/UsageInstructions';

interface ArticleRepository {
  getAll(): Promise<Article[]>;
  getById(id: ArticleId): Promise<Article>;
  getBySectionId(sectionId: string): Promise<Article>;
  getAbout(): Promise<About>;
  getIndex(): Promise<Index>;
  getUsageInstructions(): Promise<UsageInstructions>;
  getLastUpdatedTimestamp(): Promise<Date>;
}

export type { ArticleRepository };
