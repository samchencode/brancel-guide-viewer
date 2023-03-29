import type { cheerio } from '@/vendor/cheerio';
import type {
  About,
  Article,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { ArticleParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleParser';
import { AboutParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/AboutParser';
import { IndexParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/IndexParser';
import { UsageInstructionsParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/UsageInstructionsParser';
import { TableOfContentsParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/TableOfContentsParser';
import type { TableOfContents } from '@/domain/models/TableOfContents';

class BaseCheerioGuideParser {
  getTableOfContents($: cheerio.CheerioAPI): TableOfContents {
    return new TableOfContentsParser($).makeTableOfContents();
  }

  getAbout($: cheerio.CheerioAPI): About {
    return new AboutParser($).makeAbout();
  }

  getIndex($: cheerio.CheerioAPI): Index {
    return new IndexParser($).makeIndex();
  }

  getUsageInstructions($: cheerio.CheerioAPI): UsageInstructions {
    return new UsageInstructionsParser($).makeUsageInstructions();
  }

  getArticles($: cheerio.CheerioAPI): Article[] {
    return new ArticleParser($).makeAllArticles();
  }
}

export { BaseCheerioGuideParser };
