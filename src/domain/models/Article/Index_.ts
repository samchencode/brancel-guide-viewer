import { Article } from '@/domain/models/Article/Article';
import { ArticleId } from '@/domain/models/Article/ArticleId';
import type { RichText } from '@/domain/models/RichText';

class Index extends Article {
  static readonly INDEX_ID = 'INDEX';

  static readonly INDEX_TITLE = 'Index';

  readonly type = 'index';

  constructor(public readonly body: RichText, sectionIds: string[] = []) {
    super(new ArticleId(Index.INDEX_ID), Index.INDEX_TITLE, body, sectionIds);
  }
}

export { Index };
