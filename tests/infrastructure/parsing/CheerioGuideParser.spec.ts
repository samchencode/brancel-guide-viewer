import { ArticleId } from '@/domain/models/Article';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { stubGuide } from '@/infrastructure/persistence/fake/stubGuide';

describe('CheerioGuideParser', () => {
  describe('Instantiation', () => {
    it('should be created', () => {
      const create = () => new CheerioGuideParser();
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get all articles within guide', () => {
      const parser = new CheerioGuideParser();
      const articles = parser.getArticles(stubGuide);
      expect(articles).toHaveLength(11);
      articles.forEach((a) => {
        expect(a.body.html).not.toBe('');
        expect(a.body.html).toMatchSnapshot('body html');
      });
    });

    it('should set ArticleId to a[name] of article html', () => {
      const parser = new CheerioGuideParser();
      const [article] = parser.getArticles(stubGuide);
      expect(article.id.is(new ArticleId('INJURY_GUIDELINES'))).toBe(true);
    });

    it('should get "about" article', () => {
      const parser = new CheerioGuideParser();
      const about = parser.getAbout(stubGuide);
      expect(about.body.html).not.toBe('');
      expect(about.body.html).toMatchSnapshot();
    });

    it('should get "INDEX" article', () => {
      const parser = new CheerioGuideParser();
      const index = parser.getIndex(stubGuide);
      expect(index.body.html).not.toBe('');
      expect(index.body.html).toMatchSnapshot();
    });

    it('should get "Guideline_Usage_Instructions" article', () => {
      const parser = new CheerioGuideParser();
      const instructions = parser.getUsageInstructions(stubGuide);
      expect(instructions).not.toBe('');
      expect(instructions.body.html).toMatchSnapshot();
    });

    it('should get section ids within article', () => {
      const parser = new CheerioGuideParser();
      const softTissueInjuries = parser.getArticles(stubGuide)[1];
      expect(softTissueInjuries.hasSection('Neck_and_back_sprain')).toBe(true);
      expect(softTissueInjuries.hasSection('unimportant-id')).toBe(false);
      expect([...softTissueInjuries.sectionIds]).toHaveLength(38);
    });

    it('should get table of contents', () => {
      const parser = new CheerioGuideParser();
      const toc = parser.getTableOfContents(stubGuide);
      expect(toc.items).toHaveLength(11);
      expect(toc.items).toMatchSnapshot();
    });
  });
});
