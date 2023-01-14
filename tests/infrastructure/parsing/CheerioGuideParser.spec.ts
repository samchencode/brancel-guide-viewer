import { ArticleId } from '@/domain/models/Article';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser/CheerioGuideParser';
import { stubGuide } from './stubGuide';

describe('CheerioGuideParser', () => {
  describe('Instantiation', () => {
    it('should be created given an html string containing a brancel guide', () => {
      const create = () => new CheerioGuideParser(stubGuide);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should get all articles within guide', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const articles = parser.getArticles();
      expect(articles).toHaveLength(11);
      articles.forEach((a) => {
        expect(a.body.html).not.toBe('');
        expect(a.body.html).toMatchSnapshot('body html');
        expect(a.body.getText()).toMatchSnapshot('body text');
      });
    });

    it('should set ArticleId to a[name] of article html', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const [article] = parser.getArticles();
      expect(article.id.is(new ArticleId('INJURY_GUIDELINES'))).toBe(true);
    });

    it('should get "about" article', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const about = parser.getAbout();
      expect(about.body.html).not.toBe('');
      expect(about.body.html).toMatchSnapshot();
    });

    it('should get "INDEX" article', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const index = parser.getIndex();
      expect(index.body.html).not.toBe('');
      expect(index.body.html).toMatchSnapshot();
    });

    it('should get "Guideline_Usage_Instructions" article', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const instructions = parser.getUsageInstructions();
      expect(instructions).not.toBe('');
      expect(instructions.body.html).toMatchSnapshot();
    });

    it('should get section ids within article', () => {
      const parser = new CheerioGuideParser(stubGuide);
      const softTissueInjuries = parser.getArticles()[1];
      expect(softTissueInjuries.hasSection('Neck_and_back_sprain')).toBe(true);
      expect(softTissueInjuries.hasSection('unimportant-id')).toBe(false);
      expect([...softTissueInjuries.sectionIds]).toHaveLength(38);
    });
  });
});
