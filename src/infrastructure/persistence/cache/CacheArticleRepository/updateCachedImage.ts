import { ArticleId } from '@/domain/models/Article';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import type { CachedArticle } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticle';
import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';

async function updateCachedImage(
  fileSystem: FileSystem,
  cacheRepository: CacheRepository,
  cachedArticle: CachedArticle,
  originalUri: string
) {
  const fileUri = await fileSystem.cacheFile(originalUri);
  const id = new ArticleId(cachedArticle.idString);
  const newCachedImages = cachedArticle.cachedImages.slice();
  const replaceIndex = newCachedImages.findIndex(
    (i) => i.originalUri === originalUri
  );
  newCachedImages[replaceIndex] = { originalUri, fileUri };
  cacheRepository.updateCachedImagesJson(id, JSON.stringify(newCachedImages));
}

export { updateCachedImage };
