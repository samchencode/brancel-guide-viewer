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

// wait until next turn of event loop
const setImmediate = () =>
  new Promise((s) => {
    setTimeout(s, 0);
  });

type InMemoryCache = {
  tableOfContents: TableOfContents;
  about: About;
  index: Index;
  usageInstructions: UsageInstructions;
  articles: Article[];
};

class CheerioGuideParser implements GuideParser {
  private base: BaseCheerioGuideParser;

  private $?: cheerio.CheerioAPI;

  private html?: string;

  private cache: Partial<InMemoryCache> = {};

  constructor() {
    this.base = new BaseCheerioGuideParser();
  }

  async getTableOfContents(html: string): Promise<TableOfContents> {
    const cachedValue = this.getTableOfContentsFromCacheOrNull(html);
    if (cachedValue) return cachedValue;
    const $ = this.getCheerioApi(html);
    const result = this.base.getTableOfContents($);
    this.cache.tableOfContents = result;
    await setImmediate();
    return result;
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

  async getAbout(html: string): Promise<About> {
    const cachedValue = this.getAboutFromCacheOrNull(html);
    if (cachedValue) return cachedValue;
    const $ = this.getCheerioApi(html);
    const result = this.base.getAbout($);
    this.cache.about = result;
    await setImmediate();
    return result;
  }

  async getIndex(html: string): Promise<Index> {
    const cachedValue = this.getIndexFromCacheOrNull(html);
    if (cachedValue) return cachedValue;
    const $ = this.getCheerioApi(html);
    const result = this.base.getIndex($);
    this.cache.index = result;
    await setImmediate();
    return result;
  }

  async getUsageInstructions(html: string): Promise<UsageInstructions> {
    const cachedValue = this.getUsageInstructionsFromCacheOrNull(html);
    if (cachedValue) return cachedValue;
    const $ = this.getCheerioApi(html);
    const result = this.base.getUsageInstructions($);
    this.cache.usageInstructions = result;
    await setImmediate();
    return result;
  }

  async getArticles(html: string): Promise<Article[]> {
    const cachedValue = this.getArticlesFromCacheOrNull(html);
    if (cachedValue) return cachedValue;
    const $ = this.getCheerioApi(html);
    const result = this.base.getArticles($);
    this.cache.articles = result;
    await setImmediate();
    return result;
  }

  getTableOfContentsFromCacheOrNull(html: string) {
    const htmlHasChanged = this.html !== html;
    if (htmlHasChanged) return null;
    return this.cache.tableOfContents ?? null;
  }

  getAboutFromCacheOrNull(html: string) {
    const htmlHasChanged = this.html !== html;
    if (htmlHasChanged) return null;
    return this.cache.about ?? null;
  }

  getIndexFromCacheOrNull(html: string) {
    const htmlHasChanged = this.html !== html;
    if (htmlHasChanged) return null;
    return this.cache.index ?? null;
  }

  getUsageInstructionsFromCacheOrNull(html: string) {
    const htmlHasChanged = this.html !== html;
    if (htmlHasChanged) return null;
    return this.cache.usageInstructions ?? null;
  }

  getArticlesFromCacheOrNull(html: string) {
    const htmlHasChanged = this.html !== html;
    if (htmlHasChanged) return null;
    return this.cache.articles ?? null;
  }
}

export { CheerioGuideParser };
