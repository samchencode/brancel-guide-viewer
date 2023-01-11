import { cheerio } from '@/vendor/cheerio';
import type { GuideParser } from '@/infrastructure/parsing/GuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import { ArticleFinder } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleFinder';
import type { Article } from '@/domain/models/Article';

class CheerioGuideParser implements GuideParser {
  $: cheerio.CheerioAPI;

  finder: ArticleFinder;

  constructor(html: string) {
    this.$ = cheerio.load(html);
    this.finder = new ArticleFinder(this.$);
    prepare(this.$);
  }

  getAbout(): Article {
    throw new Error('Method not implemented.');
  }

  getIndex(): Article {
    throw new Error('Method not implemented.');
  }

  getUsageInstructions(): Article {
    throw new Error('Method not implemented.');
  }

  getArticles(): Article[] {
    return this.finder.findArticles().map((ap) => ap.makeArticle());
  }
}

export { CheerioGuideParser };
