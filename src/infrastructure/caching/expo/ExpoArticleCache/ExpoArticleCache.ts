import type { WebSQLDatabase } from 'expo-sqlite';
import type { Article, ArticleCache } from '@/domain/models/Article';
import { ExpoArticleCacheRepository } from '@/infrastructure/caching/expo/ExpoArticleCache/ExpoArticleCacheRepostiory';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import { cloneArticleWithNewHtml } from '@/infrastructure/caching/expo/ExpoArticleCache/articleFactory';
import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtmlBody,
} from '@/infrastructure/util/types';

class ExpoArticleCache implements ArticleCache {
  private repo: ExpoArticleCacheRepository;

  private fs: FileSystem;

  private getImageUris: GetImageUrisFromHtml;

  private replaceImageUris: ReplaceImageUrisInHtmlBody;

  constructor(
    articleCacheDatabase: WebSQLDatabase,
    fileSystem: FileSystem,
    getImageUrisFromHtml: GetImageUrisFromHtml,
    replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody
  ) {
    this.repo = new ExpoArticleCacheRepository(articleCacheDatabase);
    this.fs = fileSystem;
    this.getImageUris = getImageUrisFromHtml;
    this.replaceImageUris = replaceImageUrisInHtmlBody;
  }

  async getAllArticles(): Promise<Article[]> {
    return this.repo.getAllArticles();
  }

  async saveArticles(articles: Article[]): Promise<void> {
    const articlesAndImageUris = articles.map(
      (a) => [a, this.getImageUris(a.body.html)] as const
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
        const html = this.replaceImageUris(article.body.html, uriMap);
        return cloneArticleWithNewHtml(article, html);
      });

    await this.repo.saveArticles(newArticles);
  }
}

export { ExpoArticleCache };
