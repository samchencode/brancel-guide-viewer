import type { WebSQLDatabase } from 'expo-sqlite';
import type { Article, ArticleCache } from '@/domain/models/Article';
import { ExpoArticleCacheRepository } from '@/infrastructure/caching/expo/ExpoArticleCache/ExpoArticleCacheRepostiory';
import { getImageUris } from '@/infrastructure/caching/expo/ExpoArticleCache/getImageUrls';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { replaceImageUris } from '@/infrastructure/caching/expo/ExpoArticleCache/replaceImageUris';
import { cloneArticleWithNewHtml } from '@/infrastructure/caching/expo/ExpoArticleCache/articleFactory';

class ExpoArticleCache implements ArticleCache {
  private repo: ExpoArticleCacheRepository;

  private fs: FileSystem;

  constructor(articleCacheDatabase: WebSQLDatabase, fileSystem: FileSystem) {
    this.repo = new ExpoArticleCacheRepository(articleCacheDatabase);
    this.fs = fileSystem;
  }

  async getAllArticles(): Promise<Article[]> {
    return this.repo.getAllArticles();
  }

  async saveArticles(articles: Article[]): Promise<void> {
    const articlesAndImageUris = articles.map(
      (a) => [a, getImageUris(a.body.html)] as const
    );

    const imageDownloads = articlesAndImageUris.map(([article, uris]) =>
      Promise.all(uris.map((v) => this.fs.cacheFile(v))).then(
        (fileUris) => [article, uris, fileUris] as const
      )
    );

    const articlesAndDownloadedImageUris = await Promise.all(imageDownloads);

    const newArticles = articlesAndDownloadedImageUris
      .map(([article, uris, fileUris]) => {
        const uriPairs = uris.map((u, i) => [u, fileUris[i]] as const);
        return [article, Object.fromEntries(uriPairs)] as const;
      })
      .map(([article, uriMap]) => {
        const html = replaceImageUris(article.body.html, uriMap);
        return cloneArticleWithNewHtml(article, html);
      });

    await this.repo.saveArticles(newArticles);
  }
}

export { ExpoArticleCache };
