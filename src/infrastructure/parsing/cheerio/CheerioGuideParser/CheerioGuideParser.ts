import type {
  About,
  Article,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import type { SanitizeHtml } from '@/domain/models/RichText';
import { BaseCheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/BaseCheerioGuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import type { GuideParser } from '@/domain/models/Guide';
import { cheerio } from '@/vendor/cheerio';
import type { TableOfContents } from '@/domain/models/TableOfContents';

class CheerioGuideParser implements GuideParser {
  base: BaseCheerioGuideParser;

  $?: cheerio.CheerioAPI;

  html?: string;

  constructor(sanitizeHtml: SanitizeHtml) {
    this.base = new BaseCheerioGuideParser(sanitizeHtml);
  }

  getTableOfContents(html: string): TableOfContents {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getTableOfContents(this.$);
  }

  private makeCheerioApi(html: string) {
    const $ = cheerio.load(html);
    prepare($);
    return $;
  }

  private shouldReload(html: string) {
    return this.html !== html;
  }

  getAbout(html: string): About {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getAbout(this.$);
  }

  getIndex(html: string): Index {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getIndex(this.$);
  }

  getUsageInstructions(html: string): UsageInstructions {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getUsageInstructions(this.$);
  }

  getArticles(html: string): Article[] {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getArticles(this.$);
  }
}

export { CheerioGuideParser };
