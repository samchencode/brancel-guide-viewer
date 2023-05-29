import type {
  ArticleRepository,
  ArticleSearch,
  ArticleMatchData,
} from '@/domain/models/Article';
import { ArticleSearchResult } from '@/domain/models/Article/ArticleSearchResult';
import type { SearchableArticle } from '@/domain/models/Article/SearchableArticle';
import lunr from 'lunr';

type LunrMatchFieldMetadata = {
  position: [number, number][];
};

type LunrMatchMetadata = {
  [v: string]: {
    title?: LunrMatchFieldMetadata;
    body?: LunrMatchFieldMetadata;
  };
};

function startAndLengthToRange([start, length]: [number, number]): [
  number,
  number
] {
  return [start, start + length];
}

function metadataToMatchRanges(meta: LunrMatchMetadata): ArticleMatchData {
  const groups = Object.values(meta);
  return groups.reduce<ArticleMatchData>(
    (ag, v) => {
      const title = v.title?.position ?? [];
      const body = v.body?.position ?? [];
      return {
        title: [...ag.title, ...title.map(startAndLengthToRange)],
        body: [...ag.body, ...body.map(startAndLengthToRange)],
      };
    },
    { title: [], body: [] }
  );
}

class LunrArticleSearch implements ArticleSearch {
  searchableArticles: Promise<SearchableArticle[]>;

  idx?: Promise<lunr.Index>;

  constructor(private articleRepository: ArticleRepository) {
    this.searchableArticles = this.articleRepository.getAllSearchable();
  }

  private async getIdx() {
    if (this.idx) return this.idx;
    this.idx = this.buildIndex();
    return this.idx;
  }

  private async buildIndex() {
    const articles = await this.searchableArticles;

    return lunr(function config() {
      this.metadataWhitelist = ['position'];
      this.ref('id');
      this.field('title');
      this.field('body');

      for (const article of articles) {
        this.add(article);
      }
    });
  }

  async search(searchText: string): Promise<ArticleSearchResult[]> {
    const articles = await this.searchableArticles;
    const idx = await this.getIdx();
    const lunrResults = idx.search(searchText);
    return lunrResults.map((v) => {
      const article = articles.find((a) => a.id === v.ref);
      if (!article) throw new Error('Search result ref not found!');
      const metadata = v.matchData.metadata as LunrMatchMetadata;
      const matchRanges = metadataToMatchRanges(metadata);
      return new ArticleSearchResult(article, matchRanges, v.score);
    });
  }
}

export { LunrArticleSearch };
