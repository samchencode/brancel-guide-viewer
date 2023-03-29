import { ArticleSearchResult } from '@/domain/models/Article';

type MatchIndex = [number, number];
type MatchData = {
  title: MatchIndex[];
  body: MatchIndex[];
};

describe('ArticleSearchResult', () => {
  describe('Instantiation', () => {
    it('should create search result', () => {
      const searchableArticle = {
        id: '1',
        title: 'The Title',
        body: 'The Body',
      };
      const matchRanges: MatchData = {
        title: [[0, 5]],
        body: [[5, 6]],
      };

      const create = () =>
        new ArticleSearchResult(searchableArticle, matchRanges, 4);

      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get whole title and body when there is no match', () => {
      const searchableArticle = {
        id: '1',
        title: 'My Title',
        body: 'My Body',
      };

      const matchRanges: MatchData = {
        title: [],
        body: [],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        0
      );

      const titleSegments = searchResult.getTitleSegments();
      const bodySegments = searchResult.getBodySegments();

      expect(titleSegments).toHaveLength(1);
      expect(bodySegments).toHaveLength(1);
      expect(titleSegments[0]).toEqual({
        text: 'My Title',
        includesMatch: false,
      });
      expect(bodySegments[0]).toEqual({
        text: 'My Body',
        includesMatch: false,
      });
    });

    it('should list matches in the title', () => {
      const searchableArticle = {
        id: '1',
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, consequuntur!',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque dolor eum quod inventore nemo fuga quo reiciendis perspiciatis id? Adipisci quam architecto sit nulla aliquid voluptatum tempora cumque laboriosam facere?',
      };

      const matchRanges: MatchData = {
        title: [
          [5, 20],
          [24, 29],
        ],
        body: [[0, 23]],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        5
      );

      const segments = searchResult.getTitleSegments();

      expect(segments).toHaveLength(5);
      expect(segments[0]).toEqual({
        text: 'Lorem',
        includesMatch: false,
      });
      expect(segments[1]).toEqual({
        text: ' ipsum dolor si',
        includesMatch: true,
      });
      expect(segments[4]).toEqual({
        text: 'nsectetur adipisicing elit. Nostrum, consequuntur!',
        includesMatch: false,
      });
    });

    it('should list matches in the title with matching first segment', () => {
      const searchableArticle = {
        id: '1',
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, consequuntur!',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque dolor eum quod inventore nemo fuga quo reiciendis perspiciatis id? Adipisci quam architecto sit nulla aliquid voluptatum tempora cumque laboriosam facere?',
      };

      const matchRanges: MatchData = {
        title: [[0, 5]],
        body: [],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        5
      );

      const segments = searchResult.getTitleSegments();

      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({
        text: 'Lorem',
        includesMatch: true,
      });
    });

    it('should list matches in the body', () => {
      const searchableArticle = {
        id: '1',
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, consequuntur!',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque dolor eum quod inventore nemo fuga quo reiciendis perspiciatis id? Adipisci quam architecto sit nulla aliquid voluptatum tempora cumque laboriosam facere?',
      };

      const matchRanges: MatchData = {
        title: [],
        body: [[50, 55]],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        5
      );

      const segments = searchResult.getBodySegments();
      expect(segments).toHaveLength(3);
      expect(segments[1]).toEqual({
        text: 'g eli',
        includesMatch: true,
      });
    });

    it('should list matches in the body with matching first segment', () => {
      const searchableArticle = {
        id: '1',
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, consequuntur!',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque dolor eum quod inventore nemo fuga quo reiciendis perspiciatis id? Adipisci quam architecto sit nulla aliquid voluptatum tempora cumque laboriosam facere?',
      };

      const matchRanges: MatchData = {
        title: [],
        body: [[0, 10]],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        5
      );

      const segments = searchResult.getTruncatedBodySegments(5);
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({
        text: 'Lorem, ips',
        includesMatch: true,
      });
    });

    it('should truncate non matching segments', () => {
      const searchableArticle = {
        id: '1',
        title:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, consequuntur!',
        body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque dolor eum quod inventore nemo fuga quo reiciendis perspiciatis id? Adipisci quam architecto sit nulla aliquid voluptatum tempora cumque laboriosam facere?',
      };

      const matchRanges: MatchData = {
        title: [],
        body: [
          [25, 40],
          [70, 90],
        ],
      };

      const searchResult = new ArticleSearchResult(
        searchableArticle,
        matchRanges,
        1
      );

      const segments = searchResult.getTruncatedBodySegments(9);

      const ELLIPSIS = '\u2026';

      expect(segments).toHaveLength(5);
      expect(segments[0].text).toBe(`${ELLIPSIS}r sit am`);
      expect(segments[1].text).toBe('et consectetur ');
      expect(segments[2].text).toBe(`adip${ELLIPSIS}lor `);
      expect(segments[3].text).toBe('eum quod inventore n');
      expect(segments[4].text).toBe(`emo fuga${ELLIPSIS}`);
    });
  });
});
