import type { SearchableArticle } from '@/domain/models/Article/SearchableArticle';

type MatchIndex = [number, number];

type ArticleMatchData = {
  title: MatchIndex[];
  body: MatchIndex[];
};

type StringSegment = {
  includesMatch: boolean;
  text: string;
};

function splitAtIndicies(str: string, indices: MatchIndex[]): string[] {
  const splitAt = indices.flatMap((i) => i);
  if (splitAt[0] !== 0) splitAt.unshift(0);
  if (splitAt[splitAt.length] !== splitAt.length) splitAt.push(splitAt.length);
  splitAt.pop();
  const splitAtUniqueSorted = Array.from(new Set(splitAt)).sort(
    (a, b) => a - b
  );
  return splitAtUniqueSorted
    .map((v, i, a) => [v, a[i + 1] ?? str.length] as const)
    .map(([start, stop]) => str.slice(start, stop));
}

function breakIntoSegments(
  str: string,
  indices: MatchIndex[]
): StringSegment[] {
  const strs = splitAtIndicies(str, indices);
  const matches = indices.map(([start, stop]) => str.slice(start, stop));
  return strs.map((s) => ({
    text: s,
    includesMatch: matches.includes(s),
  }));
}

type TruncateSide = 'left' | 'both' | 'right';

function truncateToLength(
  str: string,
  length: number,
  side: TruncateSide
): string {
  if (str.length <= length) return str;
  const ELLIPSIS = '\u2026';
  if (side === 'right') {
    const segmentLength = length - 1;
    return str.slice(0, segmentLength) + ELLIPSIS;
  }
  if (side === 'left') {
    const segmentLength = length - 1;
    return ELLIPSIS + str.slice(str.length - segmentLength, str.length);
  }
  const segmentLength = Math.floor((length - 1) / 2);
  return (
    str.slice(0, segmentLength) +
    ELLIPSIS +
    str.slice(str.length - segmentLength, str.length)
  );
}

function truncateNonMatchSegments(segments: StringSegment[], length: number) {
  return segments.map((s, i, a) => {
    if (s.includesMatch) return s;
    if (s.text.length <= length) return s;
    let truncateSide: TruncateSide = 'both';
    switch (i) {
      case 0:
        truncateSide = 'left';
        break;
      case a.length - 1:
        truncateSide = 'right';
        break;
      default:
        truncateSide = 'both';
        break;
    }
    const text = truncateToLength(s.text, length, truncateSide);
    return { ...s, text };
  });
}

class ArticleSearchResult {
  constructor(
    public readonly article: SearchableArticle,
    public readonly matchData: ArticleMatchData,
    public readonly score: number
  ) {}

  getTitleSegments(): StringSegment[] {
    return breakIntoSegments(this.article.title, this.matchData.title);
  }

  getTruncatedTitleSegments(nonMatchSegmentLength: number) {
    return truncateNonMatchSegments(
      this.getTitleSegments(),
      nonMatchSegmentLength
    );
  }

  getBodySegments(): StringSegment[] {
    return breakIntoSegments(this.article.body, this.matchData.body);
  }

  getTruncatedBodySegments(nonMatchSegmentLength: number) {
    return truncateNonMatchSegments(
      this.getBodySegments(),
      nonMatchSegmentLength
    );
  }
}

export { ArticleSearchResult };
export type { ArticleMatchData, MatchIndex };
