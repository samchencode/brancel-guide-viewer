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
    const { items } = await this.cacheRepository.getTableOfContents();
    if (items.length > 0) return;
    const toc = await this.cacheSourceTableOfContentsRepository.get();
    await this.cacheRepository.saveTableOfContents(toc);
  }

  get(): Promise<TableOfContents> {
    const repoPromise = this.cacheSourceTableOfContentsRepository.get();
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedToc = await this.cacheRepository.getTableOfContents();
      // Avoid race condition between caching toc within constructor and calling get()
      if (cachedToc.items.length === 0) return repoPromise;
      return cachedToc;
    };
    return Promise.any([repoPromise, getFromCache()]);
  }
}

export { CacheTableOfContentsRepository };
