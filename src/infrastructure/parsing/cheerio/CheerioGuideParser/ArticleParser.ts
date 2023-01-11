import type { cheerio } from '@/vendor/cheerio';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';

class ArticleParser {
  constructor(
    private $: cheerio.CheerioAPI,
    public readonly id: string,
    public readonly title: string
  ) {}

  makeArticle() {
    return new Article(
      new ArticleId(this.id),
      this.title,
      new RichText(sanitizeHtml, this.getBody())
    );
  }

  private getBody(): string {
    const { $ } = this;
    const html = $(`a[name=${this.id}]`).next().html();
    // TODO: probably should raise an alert to the user if null but not crash the app
    return html ?? '';
  }
}

export { ArticleParser };
