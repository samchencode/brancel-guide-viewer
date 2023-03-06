import type {
  About,
  Article,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import type { TableOfContents } from '@/domain/models/TableOfContents';

interface GuideParser {
  getAbout(html: string): About;
  getIndex(html: string): Index;
  getUsageInstructions(html: string): UsageInstructions;
  getArticles(html: string): Article[];
  getTableOfContents(html: string): TableOfContents;
}

export type { GuideParser };
