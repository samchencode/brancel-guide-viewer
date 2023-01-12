import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

class AboutParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=about], p:has(> a[name=about])').nextAll().get();
    return $.html(elements);
  }

  makeArticle() {
    const html = this.parse();
    if (html === '') throw Error('about html is empty');
    return makeArticle(constants.ABOUT_ID, constants.ABOUT_TITLE, html);
  }
}

export { AboutParser };
