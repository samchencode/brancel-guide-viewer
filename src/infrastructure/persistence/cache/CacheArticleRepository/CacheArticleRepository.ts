import type {
  About,
  Article,
  ArticleId,
  ArticleRepository,
  Index,
  UsageInstructions,
} from '@/domain/models/Article';
import { ARTICLE_TYPES } from '@/domain/models/Article';
import type {
  GetImageUrisFromHtml,
  ReplaceImageUrisInHtmlBody,
  SanitizeHtml,
} from '@/domain/models/RichText';
import type { CacheRepository } from '@/infrastructure/persistence/cache/CacheRepository';
import { populateArticle } from '@/infrastructure/persistence/cache/CacheArticleRepository/populateArticle';
import { updateCachedImage } from '@/infrastructure/persistence/cache/CacheArticleRepository/updateCachedImage';
import { saveAllArticles } from '@/infrastructure/persistence/cache/CacheArticleRepository/saveAllArticles';
import type { CachedArticle } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticle';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

type PopulateArticle = (article: CachedArticle) => Promise<Article>;

type SaveAllArticles = (
  articles: Article[],
  lastUpdatedTimestamp: Date
) => Promise<void>;

class CacheArticleRepository implements ArticleRepository {
  private populateArticle: PopulateArticle;

  private saveAllArticles: SaveAllArticles;

  cachingArticles: Promise<void>;

  constructor(
    private articleRepository: ArticleRepository,
    private cacheRepository: CacheRepository,
    private fileSystem: FileSystem,
    getImageUrisFromHtml: GetImageUrisFromHtml,
    replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody,
    sanitizeHtml: SanitizeHtml
  ) {
    const updateCachedImageBound = updateCachedImage.bind(
      null,
      fileSystem,
      cacheRepository
    );

    this.populateArticle = (article: CachedArticle) =>
      populateArticle(
        fileSystem,
        replaceImageUrisInHtmlBody,
        sanitizeHtml,
        updateCachedImageBound,
        article
      );

    this.saveAllArticles = (articles: Article[], lastUpdatedTimestamp: Date) =>
      saveAllArticles(
        cacheRepository,
        getImageUrisFromHtml,
        fileSystem,
        articles,
        lastUpdatedTimestamp
      );

    this.cachingArticles = this.cacheArticlesIfEmptyOrStale();
  }

  private async cacheArticlesIfEmptyOrStale(): Promise<void> {
    if (await this.cacheRepository.isEmpty()) return this.cacheArticles();
    const [cacheUpdated, repoUpdated] = await Promise.all([
      this.cacheRepository.getLastUpdatedTimestamp(),
      this.articleRepository.getLastUpdatedTimestamp(),
    ]);
    if (cacheUpdated < repoUpdated) return this.cacheArticles();
    return Promise.resolve();
  }

  private async cacheArticles(): Promise<void> {
    const articles = await this.articleRepository.getAll();
    const timestamp = await this.articleRepository.getLastUpdatedTimestamp();
    await this.clearCache();
    await this.saveAllArticles(articles, timestamp);
  }

  async getAll(): Promise<Article[]> {
    // Caching is not implemented for this method!
    // Loading all images as Base64 into memory may be slow
    return this.articleRepository.getAll();
  }

  getById(id: ArticleId): Promise<Article> {
    const repoPromise = this.articleRepository.getById(id);

    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedArticle = await this.cacheRepository.getArticleById(id);
      return this.populateArticle(cachedArticle);
    };
    return Promise.any([repoPromise, getFromCache()]);
  }

  getBySectionId(sectionId: string): Promise<Article> {
    const repoPromise = this.articleRepository.getBySectionId(sectionId);
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedArticle = await this.cacheRepository.getArticleBySectionId(
        sectionId
      );
      return this.populateArticle(cachedArticle);
    };
    return Promise.any([repoPromise, getFromCache()]);
  }

  getAbout(): Promise<About> {
    const repoPromise = this.articleRepository.getAbout();
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedArticle = await this.cacheRepository.getArticleByType(
        ARTICLE_TYPES.ABOUT
      );
      const article = await this.populateArticle(cachedArticle);
      return article as About;
    };
    return Promise.any([repoPromise, getFromCache()]);
  }

  getIndex(): Promise<Index> {
    const repoPromise = this.articleRepository.getIndex();
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedArticle = await this.cacheRepository.getArticleByType(
        ARTICLE_TYPES.INDEX
      );
      const article = await this.populateArticle(cachedArticle);
      return article as Index;
    };
    return Promise.any([repoPromise, getFromCache()]);
  }

  getUsageInstructions(): Promise<UsageInstructions> {
    const repoPromise = this.articleRepository.getUsageInstructions();
    const getFromCache = async () => {
      if (await this.cacheRepository.isEmpty()) return repoPromise;
      const cachedArticle = await this.cacheRepository.getArticleByType(
        ARTICLE_TYPES.USAGE_INSTRUCTIONS
      );
      const article = await this.populateArticle(cachedArticle);
      return article as UsageInstructions;
    };
    return Promise.any([repoPromise, getFromCache()]);
  }

  getLastUpdatedTimestamp(): Promise<Date> {
    return this.cacheRepository.getLastUpdatedTimestamp();
  }

  async clearCache() {
    const cachedImages = await this.cacheRepository.getAllCachedImages();
    const deletions = cachedImages
      .map((v) => v.fileUri)
      .map((uri) => this.fileSystem.deleteFile(uri));
    const removeFromRepo = await this.cacheRepository.delete();
    await Promise.all([removeFromRepo, ...deletions]);
  }
}

export { CacheArticleRepository };
