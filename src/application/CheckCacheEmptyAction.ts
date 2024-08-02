import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';

class CheckCacheEmptyAction {
  constructor(private readonly cacheRepository: CacheRepository) {}

  async execute() {
    return this.cacheRepository.isEmpty();
  }

  static $inject = ['cacheRepository'];
}

export { CheckCacheEmptyAction };
