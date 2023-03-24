import type { Article } from '@/domain/models/Article';
import type { GetImageUrisFromHtml } from '@/domain/models/RichText';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { ArticleToBeCached } from '@/infrastructure/persistence/cache/CacheArticleRepository/ArticleToBeCached';
import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';

async function saveAllArticles(
  cacheRepository: CacheRepository,
  getImageUrisFromHtml: GetImageUrisFromHtml,
  fileSystem: FileSystem,
  articles: Article[],
  lastUpdatedTimestamp: Date
) {
  async function prepareArticlesToBeCached(article: Article) {
    const imageUris = getImageUrisFromHtml(article.body.html);
    const fileUris = await Promise.all(
      imageUris.map((uri) => fileSystem.cacheFile(uri))
    );
    const imagesToBeCached = imageUris.map((originalUri, i) => ({
      originalUri,
      fileUri: fileUris[i],
    }));
    return new ArticleToBeCached(article, imagesToBeCached);
  }

  const articlesToBeCached = await Promise.all(
    articles.map(prepareArticlesToBeCached)
  );
  return cacheRepository.saveAllArticles(
    articlesToBeCached,
    lastUpdatedTimestamp
  );
}

export { saveAllArticles };
