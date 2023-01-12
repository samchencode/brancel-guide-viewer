import { Article, ArticleId } from '@/domain/models/Article';
import type { cheerio } from '@/vendor/cheerio';
import * as constants from '@/infrastructure/parsing/cheerio/CheerioGuideParser/constants';
import { RichText } from '@/domain/models/RichText';
import { sanitizeHtml } from '@/vendor/sanitizeHtml';

class UsageInstructionsParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=Guideline_Navigation_Instructions]').nextUntil(
      'p:has(> hr), p:has(> a[name="about"]), hr, a[name="about"]'
    );
    return $.html(elements);
  }

  makeArticle() {
    const id = new ArticleId(constants.INSTRUCTIONS_ID);
    const html = this.parse();
    return new Article(
      id,
      constants.INSTRUCTIONS_TITLE,
      new RichText(sanitizeHtml, html)
    );
  }
}

export { UsageInstructionsParser };
