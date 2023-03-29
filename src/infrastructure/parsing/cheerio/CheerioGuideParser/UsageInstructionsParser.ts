import type { cheerio } from '@/vendor/cheerio';
import { makeUsageInstructions } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

class UsageInstructionsParser {
  constructor(private $: cheerio.CheerioAPI) {}

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
    return makeUsageInstructions(html);
  }
}

export { UsageInstructionsParser };
