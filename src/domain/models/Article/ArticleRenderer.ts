import type { Article } from '@/domain/models/Article';

interface ArticleRenderer {
  render(article: Article): Promise<string>;
}

export type { ArticleRenderer };
