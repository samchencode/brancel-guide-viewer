import type { TableOfContents } from '@/domain/models/TableOfContents/TableOfContents';

interface TableOfContentsRepository {
  get(): Promise<TableOfContents>;
}

export type { TableOfContentsRepository };
