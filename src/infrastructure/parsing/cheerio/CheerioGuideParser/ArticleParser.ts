import type { cheerio } from '@/vendor/cheerio';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';
import { Article, ArticleId } from '@/domain/models/Article';
import { RichText } from '@/domain/models/RichText';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';

class ArticleParser {
  constructor(private $: cheerio.CheerioAPI) {}

  makeAllArticles() {
    return this.parseTableOfContents().map(({ id, title }) =>
      this.makeArticle(id, title)
    );
  }

  private parseTableOfContents() {
    const { $ } = this;
    const contents = $('ul a.index[href^=#]').get();
    return contents
      .filter((el) => $(el).text() !== '')
      .filter((el) => $(el).attr('href')?.slice(1) !== constants.ABOUT_ID)
      .map((el) => {
        const id = $(el).attr('href')?.slice(1);
        const title = $(el).text();
        if (!id)
          throw new Error(`Missing href in table of contents item: ${title}`);
        return { id, title };
      });
  }

  private makeArticle(id: string, title: string) {
    return new Article(
      new ArticleId(id),
      title,
      new RichText(sanitizeHtml, this.getBody(id))
    );
  }

  private getBody(id: string): string {
    const { $ } = this;
    const html = $(`a[name=${id}]`).next().html();
    // TODO: probably should raise an alert to the user if null but not crash the app
    return html ?? '';
  }
}

export { ArticleParser };
