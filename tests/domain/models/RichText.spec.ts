import { RichText } from '@/domain/models/RichText';

describe('RichText', () => {
  describe('Instantiation', () => {
    it('should be created with html string and a sanitizer function', () => {
      const html = '<h1>hai</h1>';
      const create = () => new RichText(jest.fn(), html);
      expect(create).not.toThrowError();
    });
  });

  describe('Behavior', () => {
    it('should retrieve html string', () => {
      const html = '<h1>Hello World</h1>';
      const text = new RichText(jest.fn(), html);
      expect(text.html).toBe('<h1>Hello World</h1>');
    });

    it('should remove html using sanitizer function provided', () => {
      const sanitizer = (s: string) => s.replace(/<\/?[^>]+(>|$)/g, '');
      const html = '<h1>Hello World</h1>';
      const text = new RichText(sanitizer, html);
      expect(text.getText()).toBe('Hello World');
    });
  });
});
