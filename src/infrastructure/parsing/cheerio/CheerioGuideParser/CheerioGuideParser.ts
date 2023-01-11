import { cheerio } from '@/vendor/cheerio';
import type { GuideParser } from '@/infrastructure/parsing/GuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import type { Article } from '@/domain/models/Article';
import { ArticleParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleParser';
import { AboutParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/AboutParser';

class CheerioGuideParser implements GuideParser {
  $: cheerio.CheerioAPI;

  constructor(html: string) {
    this.$ = cheerio.load(html);
    prepare(this.$);
  }

  getAbout(): Article {
    return new AboutParser(this.$).makeArticle();
  }

  getIndex(): Article {
    throw new Error('Method not implemented.');
  }

  getUsageInstructions(): Article {
    throw new Error('Method not implemented.');
  }

  getArticles(): Article[] {
    return new ArticleParser(this.$).makeAllArticles();
  }
}

export { CheerioGuideParser };
