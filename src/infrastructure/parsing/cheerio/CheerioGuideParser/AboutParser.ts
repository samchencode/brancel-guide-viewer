import type { cheerio } from '@/vendor/cheerio';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';
import { makeAbout } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

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

  makeAbout() {
    const html = this.parse();
    if (html === '') throw Error('about html is empty');
    return makeAbout(html, this.sanitizeHtml);
  }
}

export { AboutParser };
