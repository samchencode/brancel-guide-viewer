import type { CacheArticleRepository } from '@/infrastructure/persistence/cache/CacheArticleRepository';

class ClearCacheAction {
  constructor(
    private readonly cacheArticleRepository: CacheArticleRepository
  ) {}

  async execute() {
    return this.cacheArticleRepository.clearCache();
  }
}

export { ClearCacheAction };
