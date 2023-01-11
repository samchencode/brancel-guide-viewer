import type { Article } from '@/domain/models/Article';

interface GuideParser {
  getAbout(): Article;
  getIndex(): Article;
  getUsageInstructions(): Article;
  getArticles(): Article[];
}

export type { GuideParser };
