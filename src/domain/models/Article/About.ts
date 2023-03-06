import { Article } from '@/domain/models/Article/Article';
import { ArticleId } from '@/domain/models/Article/ArticleId';
import { ARTICLE_TYPES } from '@/domain/models/Article/constants';
import type { RichText } from '@/domain/models/RichText';

class About extends Article {
  static readonly ABOUT_ID = 'about';

  static readonly ABOUT_TITLE = 'About This Guide';

  readonly type = ARTICLE_TYPES.ABOUT;

  constructor(body: RichText, sectionIds: string[] = []) {
    super(new ArticleId(About.ABOUT_ID), About.ABOUT_TITLE, body, sectionIds);
  }
}

export { About };
