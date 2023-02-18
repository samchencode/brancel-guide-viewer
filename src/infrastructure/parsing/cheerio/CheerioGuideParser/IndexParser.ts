import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

class IndexParser {
  constructor(
    private $: cheerio.CheerioAPI,
    private sanitizeHtml: SanitizeHtml
  ) {}

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
    const html = this.parse();
    if (html === '') throw Error('index html is empty');
    return makeArticle(
      constants.INDEX_ID,
      constants.INDEX_TITLE,
      html,
      this.sanitizeHtml
    );
  }
}

export { IndexParser };
