import type { cheerio } from '@/vendor/cheerio';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';

class AboutParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=about], p:has(> a[name=about])').nextAll().get();
    return elements.map((e) => $(e).html()).join(' ');
  }

  makeArticle() {
    const id = new ArticleId(constants.ABOUT_ID);
    const html = this.parse();
    if (html === '') throw Error('about html is empty');
    const body = new RichText(sanitizeHtml, html);
    return new Article(id, constants.ABOUT_TITLE, body);
  }
}

export { AboutParser };
