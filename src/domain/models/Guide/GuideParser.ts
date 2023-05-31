import type {
  About,
  Article,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import type { TableOfContents } from '@/domain/models/TableOfContents';

interface GuideParser {
  getAbout(html: string): Promise<About>;
  getIndex(html: string): Promise<Index>;
  getUsageInstructions(html: string): Promise<UsageInstructions>;
  getArticles(html: string): Promise<Article[]>;
  getTableOfContents(html: string): Promise<TableOfContents>;
}

export type { GuideParser };
