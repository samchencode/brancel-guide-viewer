import type { Article } from '@/domain/models/Article';

interface GuideParser {
  getAbout(html: string): Article;
  getIndex(html: string): Article;
  getUsageInstructions(html: string): Article;
  getArticles(html: string): Article[];
}

export type { GuideParser };
