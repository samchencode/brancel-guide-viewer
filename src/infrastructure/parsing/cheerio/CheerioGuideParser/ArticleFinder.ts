import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { ArticleParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleParser';

class ArticleFinder {
  constructor(private $: cheerio.CheerioAPI) {}

  findIndex() {
    throw new Error('not implemented');
  }

  findUsageInstructions() {
    throw new Error('not implemented');
  }

  findAbout() {
    throw new Error('not implemented');
  }

  findArticles() {
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
        return new ArticleParser($, id, title);
      });
  }
}

export { ArticleFinder };
