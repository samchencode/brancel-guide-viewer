import type { Article } from '@/domain/models/Article';
import type { TableOfContents } from '@/domain/models/TableOfContents';

interface GuideParser {
  getAbout(html: string): Article;
  getIndex(html: string): Article;
  getUsageInstructions(html: string): Article;
  getArticles(html: string): Article[];
  getTableOfContents(html: string): TableOfContents;
}

export type { GuideParser };
