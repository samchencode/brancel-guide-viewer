import { cheerio } from '@/vendor/cheerio';
import type { GuideParser } from '@/infrastructure/parsing/GuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import type { Article } from '@/domain/models/Article';
import { ArticleParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleParser';
import { AboutParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/AboutParser';
import { IndexParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/IndexParser';
import { UsageInstructionsParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/UsageInstructionsParser';

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
    return new IndexParser(this.$).makeArticle();
  }

  getUsageInstructions(): Article {
    return new UsageInstructionsParser(this.$).makeArticle();
  }

  getArticles(): Article[] {
    return new ArticleParser(this.$).makeAllArticles();
  }
}

export { CheerioGuideParser };
