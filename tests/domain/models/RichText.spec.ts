import { RichText } from '@/domain/models/RichText/RichText';

describe('RichText', () => {
  describe('Instantiation', () => {
    it('should be created with html string and a sanitizer function', () => {
      const html = '<h1>hai</h1>';
      const create = () => new RichText(html);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should retrieve html string', () => {
      const html = '<h1>Hello World</h1>';
      const text = new RichText(html);
      expect(text.html).toBe('<h1>Hello World</h1>');
    });
  });
});
