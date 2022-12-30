import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { RichText } from '@/domain/models/RichText';

class Article {
  constructor(
    public readonly id: ArticleId,
    public readonly title: string,
    public readonly body: RichText
  ) {}
}

export { Article };
