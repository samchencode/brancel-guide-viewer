import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

class AboutParser {
  constructor(
    private $: cheerio.CheerioAPI,
    private sanitizeHtml: SanitizeHtml
  ) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=about], p:has(> a[name=about])').nextAll().get();
    return $.html(elements);
  }

  makeArticle() {
    const html = this.parse();
    if (html === '') throw Error('about html is empty');
    return makeArticle(
      constants.ABOUT_ID,
      constants.ABOUT_TITLE,
      html,
      this.sanitizeHtml
    );
  }
}

export { AboutParser };
