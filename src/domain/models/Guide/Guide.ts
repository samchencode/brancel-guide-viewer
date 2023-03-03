import type { GuideParser } from '@/domain/models/Guide/GuideParser';

class Guide {
  constructor(
    public readonly html: string,
    private readonly parser: GuideParser
  ) {}

  getTableOfContents() {
    return this.parser.getTableOfContents(this.html);
  }

  getArticles() {
    return this.parser.getArticles(this.html);
  }

  getAbout() {
    return this.parser.getAbout(this.html);
  }

  getUsageInstructions() {
    return this.parser.getUsageInstructions(this.html);
  }

  getIndex() {
    return this.parser.getIndex(this.html);
  }
}

export { Guide };
