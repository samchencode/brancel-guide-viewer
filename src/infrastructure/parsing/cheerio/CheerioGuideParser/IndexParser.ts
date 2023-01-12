import { Article, ArticleId } from '@/domain/models/Article';
import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

class IndexParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=INDEX] ~ a[name=A]').nextUntil(
      `hr,
      a[name=Guideline_Navigation_Instructions],
      .content:has(hr),
      .content:has(a[name=Guideline_Navigation_Instructions])`
    );
    return $.html(elements);
  }

  makeArticle() {
    const id = new ArticleId(constants.INDEX_ID);
    const html = this.parse();
    return new Article(
      id,
      constants.INDEX_TITLE,
      new RichText(sanitizeHtml, html)
    );
  }
}

export { IndexParser };
