import type { Article } from '@/domain/models/Article';
import type { SanitizeHtml } from '@/domain/models/RichText';
import { BaseCheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/BaseCheerioGuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import type { GuideParser } from '@/infrastructure/parsing/GuideParser';
import { cheerio } from '@/vendor/cheerio';

class CheerioGuideParser implements GuideParser {
  base: BaseCheerioGuideParser;

  $?: cheerio.CheerioAPI;

  html?: string;

  constructor(santizeHtml: SanitizeHtml) {
    this.base = new BaseCheerioGuideParser(santizeHtml);
  }

  private makeCheerioApi(html: string) {
    const $ = cheerio.load(html);
    prepare($);
    return $;
  }

  private shouldReload(html: string) {
    return this.html !== html;
  }

  getAbout(html: string): Article {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getAbout(this.$);
  }

  getIndex(html: string): Article {
    if (!this.$ || this.shouldReload(html)) {
      this.$ = this.makeCheerioApi(html);
    }
    return this.base.getIndex(this.$);
  }

  getUsageInstructions(html: string): Article {
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
