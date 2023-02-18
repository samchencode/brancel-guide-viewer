import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { makeArticle } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

class ArticleParser {
  constructor(
    private $: cheerio.CheerioAPI,
    private sanitizeHtml: SanitizeHtml
  ) {}

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

  private makeArticle(idString: string, title: string) {
    return makeArticle(
      idString,
      title,
      this.getBody(idString),
      this.sanitizeHtml
    );
  }

  private getBody(id: string): string {
    const { $ } = this;
    const html = $(`a[name=${id}]`).next().html();
    if (html === null) throw new Error(`article ${id} not found`);
    return html;
  }
}

export { ArticleParser };
