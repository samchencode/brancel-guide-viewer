import type { TableOfContentsItem } from '@/domain/models/TableOfContents/TableOfContentsItem';

class TableOfContents {
  constructor(public readonly items: TableOfContentsItem[]) {}
}

export { TableOfContents };
