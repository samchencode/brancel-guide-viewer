import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

class UsageInstructionsParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=Guideline_Navigation_Instructions]').nextUntil(
      'p:has(> hr), p:has(> a[name="about"]), hr, a[name="about"]'
    );
    return $.html(elements);
  }

  makeArticle() {
    const html = this.parse();
    if (html === '') throw new Error('instructions html is empty');
    return makeArticle(
      constants.INSTRUCTIONS_ID,
      constants.INSTRUCTIONS_TITLE,
      html
    );
  }
}

export { UsageInstructionsParser };
