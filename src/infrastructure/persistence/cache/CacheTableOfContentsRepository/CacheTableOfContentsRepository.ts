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

  async get(): Promise<TableOfContents> {
    const getFromRepo = () => this.cacheSourceTableOfContentsRepository.get();
    try {
      if (await this.cacheRepository.isEmpty()) return await getFromRepo();
      const cachedToc = await this.cacheRepository.getTableOfContents();
      if (cachedToc.items.length === 0) {
        // if cache TOC is empty, then put in the info from source repo asynchronously
        const newToc = await getFromRepo();
        this.cacheRepository.saveTableOfContents(newToc);
        return newToc;
      }
      return cachedToc;
    } catch (e) {
      return getFromRepo();
    }
  }
}

export { CacheTableOfContentsRepository };
