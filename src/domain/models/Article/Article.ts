import type { ArticleId } from '@/domain/models/Article/ArticleId';
import { ARTICLE_TYPES } from '@/domain/models/Article/constants';
import type { RichText } from '@/domain/models/RichText/RichText';

class Article {
  public readonly sectionIds: Set<string>;

  public type: string = ARTICLE_TYPES.BASE;

  constructor(
    public readonly id: ArticleId,
    public readonly title: string,
    public readonly body: RichText,
    sectionIds: string[] = []
  ) {
    this.sectionIds = new Set(sectionIds).add(id.toString());
  }

  hasSection(id: string) {
    return this.sectionIds.has(id);
  }
}

export { Article };
