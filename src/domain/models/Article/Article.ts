import type { ArticleId } from '@/domain/models/Article/ArticleId';
import type { RichText } from '@/domain/models/RichText/RichText';

class Article {
  public readonly sectionIds: Set<string>;

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
