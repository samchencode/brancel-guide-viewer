import type {
  TableOfContents,
  TableOfContentsRepository,
} from '@/domain/models/TableOfContents';
import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';

class CacheTableOfContentsRepository implements TableOfContentsRepository {
  cachingTableOfContents: Promise<void>;

  constructor(
    private readonly cacheSourceTableOfContentsRepository: TableOfContentsRepository,
    private readonly cacheRepository: CacheRepository
  ) {
    this.cachingTableOfContents = this.cacheTableOfContentsIfEmpty();
  }

  async cacheTableOfContentsIfEmpty() {
    if (!(await this.cacheRepository.isEmpty())) return;
    const toc = await this.cacheSourceTableOfContentsRepository.get();
    await this.cacheRepository.saveTableOfContents(toc);
  }

  get(): Promise<TableOfContents> {
    const repoPromise = this.cacheSourceTableOfContentsRepository.get();
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      return this.cacheRepository.getTableOfContents();
    };
    return Promise.any([repoPromise, getFromCache()]);
  }
}

export { CacheTableOfContentsRepository };
