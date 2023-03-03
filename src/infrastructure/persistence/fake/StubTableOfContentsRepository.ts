import type { TableOfContentsRepository } from '@/domain/models/TableOfContents';
import {
  TableOfContents,
  TableOfContentsItem,
} from '@/domain/models/TableOfContents';

class StubTableOfContentsRepository implements TableOfContentsRepository {
  async get(): Promise<TableOfContents> {
    return new TableOfContents([
      new TableOfContentsItem(
        'Resurrection, A',
        'bbf46939-a2eb-493c-9b64-c2b8c00203b2'
      ),
      new TableOfContentsItem(
        'Radioactive Dreams',
        '724c9644-4bb1-4dc9-8131-edaeb0d0fc17'
      ),
      new TableOfContentsItem(
        'Death by China ',
        'df2dc7c1-7324-4418-ab41-100af5681ca8'
      ),
      new TableOfContentsItem(
        'Pont du Nord, Le',
        '313299af-d447-45a2-a3ed-63725ee5ca7c'
      ),
    ]);
  }
}

export { StubTableOfContentsRepository };
