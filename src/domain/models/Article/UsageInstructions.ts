import { Article } from '@/domain/models/Article/Article';
import { ArticleId } from '@/domain/models/Article/ArticleId';
import type { RichText } from '@/domain/models/RichText';

class UsageInstructions extends Article {
  static readonly USAGE_INSTRUCTIONS_ID = 'Guideline_Navigation_Instructions';

  static readonly USAGE_INSTRUCTIONS_TITLE =
    'Guideline Navigation Instructions';

  readonly type = 'usage-instructions';

  constructor(body: RichText, sectionIds: string[] = []) {
    super(
      new ArticleId(UsageInstructions.USAGE_INSTRUCTIONS_ID),
      UsageInstructions.USAGE_INSTRUCTIONS_TITLE,
      body,
      sectionIds
    );
  }
}

export { UsageInstructions };
