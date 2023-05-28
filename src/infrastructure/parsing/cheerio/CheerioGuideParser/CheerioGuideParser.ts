import type {
  About,
  Article,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { BaseCheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/BaseCheerioGuideParser';
import { prepare } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/prepare';
import type { GuideParser } from '@/domain/models/Guide';
import { cheerio } from '@/vendor/cheerio';
import type { TableOfContents } from '@/domain/models/TableOfContents';

class CheerioGuideParser implements GuideParser {
  private base: BaseCheerioGuideParser;

  private $?: cheerio.CheerioAPI;

  private html?: string;

  constructor() {
    this.base = new BaseCheerioGuideParser();
  }

  getTableOfContents(html: string): TableOfContents {
    const $ = this.getCheerioApi(html);
    return this.base.getTableOfContents($);
  }

  private makeCheerioApi(html: string) {
    const $ = cheerio.load(html);
    prepare($);
    return $;
  }

  private getCheerioApi(html: string): cheerio.CheerioAPI {
    const htmlHasChanged = this.html !== html;
    if (!this.$ || htmlHasChanged) {
      this.html = html;
      this.$ = this.makeCheerioApi(html);
    }
    return this.$;
  }

  getAbout(html: string): About {
    const $ = this.getCheerioApi(html);
    return this.base.getAbout($);
  }

  getIndex(html: string): Index {
    const $ = this.getCheerioApi(html);
    return this.base.getIndex($);
  }

  getUsageInstructions(html: string): UsageInstructions {
    const $ = this.getCheerioApi(html);
    return this.base.getUsageInstructions($);
  }

  getArticles(html: string): Article[] {
    const $ = this.getCheerioApi(html);
    return this.base.getArticles($);
  }
}

export { CheerioGuideParser };
