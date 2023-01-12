import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

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
    const html = this.parse();
    if (html === '') throw Error('index html is empty');
    return makeArticle(constants.INDEX_ID, constants.INDEX_TITLE, html);
  }
}

export { IndexParser };
