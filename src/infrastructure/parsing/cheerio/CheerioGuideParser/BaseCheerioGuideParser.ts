import type { cheerio } from '@/vendor/cheerio';
import type { Article } from '@/domain/models/Article';
import { ArticleParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/ArticleParser';
import { AboutParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/AboutParser';
import { IndexParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/IndexParser';
import { UsageInstructionsParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/UsageInstructionsParser';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';
import { TableOfContentsParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/TableOfContentsParser';
import type { TableOfContents } from '@/domain/models/TableOfContents';

class BaseCheerioGuideParser {
  constructor(private sanitizeHtml: SanitizeHtml) {}

  getTableOfContents($: cheerio.CheerioAPI): TableOfContents {
    return new TableOfContentsParser($).makeTableOfContents();
  }

  getAbout($: cheerio.CheerioAPI): Article {
    return new AboutParser($, this.sanitizeHtml).makeArticle();
  }

  getIndex($: cheerio.CheerioAPI): Article {
    return new IndexParser($, this.sanitizeHtml).makeArticle();
  }

  getUsageInstructions($: cheerio.CheerioAPI): Article {
    return new UsageInstructionsParser($, this.sanitizeHtml).makeArticle();
  }

  getArticles($: cheerio.CheerioAPI): Article[] {
    return new ArticleParser($, this.sanitizeHtml).makeAllArticles();
  }
}

export { BaseCheerioGuideParser };
