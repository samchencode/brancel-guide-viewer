import type { cheerio } from '@/vendor/cheerio';
import { makeUsageInstructions } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';
import type { SanitizeHtml } from '@/domain/models/RichText/htmlManipulationUtils';

class UsageInstructionsParser {
  constructor(
    private $: cheerio.CheerioAPI,
    private sanitizeHtml: SanitizeHtml
  ) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=Guideline_Navigation_Instructions]').nextUntil(
      'p:has(> hr), p:has(> a[name="about"]), hr, a[name="about"]'
    );
    return $.html(elements);
  }

  makeUsageInstructions() {
    const html = this.parse();
    if (html === '') throw new Error('instructions html is empty');
    return makeUsageInstructions(html, this.sanitizeHtml);
  }
}

export { UsageInstructionsParser };
