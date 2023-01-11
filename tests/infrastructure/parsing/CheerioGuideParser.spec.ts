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
        expect(a.body.html).toMatchSnapshot('body html');
        expect(a.body.getText()).toMatchSnapshot('body text');
      });
    });
  });
});
