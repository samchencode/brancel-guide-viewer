import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import {
  TableOfContents,
  TableOfContentsItem,
} from '@/domain/models/TableOfContents';

class TableOfContentsParser {
  constructor(private readonly $: cheerio.CheerioAPI) {}

  private parse() {
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

  makeTableOfContents() {
    const items = this.parse().map(
      ({ id, title }) => new TableOfContentsItem(title, id)
    );

    return new TableOfContents(items);
  }
}

export { TableOfContentsParser };
