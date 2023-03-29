import type { cheerio } from '@/vendor/cheerio';
import { makeIndex } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/articleFactory';

class IndexParser {
  constructor(private $: cheerio.CheerioAPI) {}

  private parse() {
    const { $ } = this;
    const elements = $('a[name=INDEX] ~ a[name=A]')
      .nextUntil(
        `hr,
      a[name=Guideline_Navigation_Instructions],
      .content:has(hr),
      .content:has(a[name=Guideline_Navigation_Instructions])`
      )
      .addBack();
    return $.html(elements);
  }

  makeIndex() {
    const html = this.parse();
    if (html === '') throw Error('index html is empty');
    return makeIndex(html);
  }
}

export { IndexParser };
