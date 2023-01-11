import type { cheerio } from '@/vendor/cheerio';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

class AboutParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=about], p:has(> a[name=about])').nextAll().get();
    return elements.map((e) => $(e).html()).join(' ');
  }

  makeArticle() {
    const id = new ArticleId('about');
    const html = this.parse();
    if (html === null) throw Error('about html is null');
    const body = new RichText(sanitizeHtml, html);
    return new Article(id, 'About This Guide', body);
  }
}

export { AboutParser };
