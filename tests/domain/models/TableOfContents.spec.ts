import { TableOfContentsItem } from '@/domain/models/TableOfContents';
import { TableOfContents } from '@/domain/models/TableOfContents/TableOfContents';

describe('TableOfContents', () => {
  describe('Instantiation', () => {
    it('should be created with an empty list of items', () => {
      const create = () => new TableOfContents([]);
      expect(create).not.toThrowError();
    });

    it('should be created with list of items', () => {
      const create = () =>
        new TableOfContents([
          new TableOfContentsItem('First Article', 'first'),
        ]);
      expect(create).not.toThrowError();
    });
  });
});
