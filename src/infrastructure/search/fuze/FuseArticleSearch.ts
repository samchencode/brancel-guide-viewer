import type {
  ArticleRepository,
  ArticleSearch,
  SearchableArticle,
  ArticleMatchData,
} from '@/domain/models/Article';
import { ArticleSearchResult } from '@/domain/models/Article';
import Fuse from 'fuse.js';

const fuseOptions = {
  isCaseSensitive: false,
  includeScore: true, // 0 = perfect match, 1 = no match at all
  shouldSort: true,
  includeMatches: true,
  keys: ['title', 'body'],
};

function matchesToMatchData(
  matches: Readonly<Fuse.FuseResultMatch[]>
): ArticleMatchData {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleMatches = matches.find((m) => m.key === 'title')!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const bodyMatches = matches.find((m) => m.key === 'body')!;
  const titleIndices = titleMatches.indices.filter((i) => i[0] !== i[1]);
  const bodyIndices = bodyMatches.indices.filter((i) => i[0] !== i[1]);
  return {
    title: titleIndices,
    body: bodyIndices,
  };
}

class FuseArticleSearch implements ArticleSearch {
  private fuse: Promise<Fuse<SearchableArticle>>;

  constructor(private readonly articleRepository: ArticleRepository) {
    this.fuse = this.prepareFuse();
  }

  private async prepareFuse() {
    const articles = await this.articleRepository.getAllSearchable();
    return new Fuse(articles, fuseOptions);
  }

  async search(searchText: string): Promise<ArticleSearchResult[]> {
    const fuse = await this.fuse;
    const fuseResults = fuse.search(searchText);
    return fuseResults.map((result) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const matchRanges = matchesToMatchData(result.matches!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const score = 1 - result.score!;
      return new ArticleSearchResult(result.item, matchRanges, score);
    });
  }
}

export { FuseArticleSearch };
