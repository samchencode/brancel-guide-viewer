import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import type { CacheArticleRepository } from '@/infrastructure/persistence/cache/CacheArticleRepository';

class ClearCacheAction {
  constructor(
    private readonly cacheArticleRepository: CacheArticleRepository,
    private readonly fileSystem: FileSystem
  ) {}

  async execute() {
    await this.cacheArticleRepository.clearCache();
    await this.fileSystem.clearCache();
  }

  static $inject = ['cacheArticleRepository', 'fileSystem'];
}

export { ClearCacheAction };
