import type {
  About,
  Article,
  ArticleId,
  ArticleRepository,
  Index,
  SearchableArticle,
  UsageInstructions,
} from '@/domain/models/Article';
import {
  ARTICLE_TYPES,
  ArticleNotFoundError,
  ArticleSectionNotFoundError,
} from '@/domain/models/Article';
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
    private cacheSourceArticleRepository: ArticleRepository,
    private cacheRepository: CacheRepository,
    private fileSystem: FileSystem,
    private sanitizeHtml: SanitizeHtml,
    getImageUrisFromHtml: GetImageUrisFromHtml,
    replaceImageUrisInHtmlBody: ReplaceImageUrisInHtmlBody
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
      this.cacheSourceArticleRepository.getLastUpdatedTimestamp(),
    ]);
    if (cacheUpdated < repoUpdated) return this.cacheArticles();
    return Promise.resolve();
  }

  private async cacheArticles(): Promise<void> {
    const articles = await this.cacheSourceArticleRepository.getAll();
    const timestamp =
      await this.cacheSourceArticleRepository.getLastUpdatedTimestamp();
    await this.clearCache();
    await this.saveAllArticles(articles, timestamp);
  }

  private async getFromCacheIfNotEmpty(
    getFromRepo: () => Promise<Article>,
    getFromCache: () => Promise<CachedArticle>
  ): Promise<Article> {
    try {
      if (await this.cacheRepository.isEmpty()) return await getFromRepo();
      const cachedArticle = await getFromCache();
      return await this.populateArticle(cachedArticle);
    } catch (e) {
      if (e instanceof ArticleNotFoundError) throw e;
      if (e instanceof ArticleSectionNotFoundError) throw e;
      return getFromRepo();
    }
  }

  async getAll(): Promise<Article[]> {
    // Caching is not implemented for this method!
    // Loading all images as Base64 into memory may be slow
    return this.cacheSourceArticleRepository.getAll();
  }

  getById(id: ArticleId): Promise<Article> {
    const getFromRepo = () => this.cacheSourceArticleRepository.getById(id);
    const getFromCache = () => this.cacheRepository.getArticleById(id);
    return this.getFromCacheIfNotEmpty(getFromRepo, getFromCache);
  }

  getBySectionId(sectionId: string): Promise<Article> {
    const getFromRepo = () =>
      this.cacheSourceArticleRepository.getBySectionId(sectionId);
    const getFromCache = () =>
      this.cacheRepository.getArticleBySectionId(sectionId);
    return this.getFromCacheIfNotEmpty(getFromRepo, getFromCache);
  }

  getAbout(): Promise<About> {
    const getFromRepo = () => this.cacheSourceArticleRepository.getAbout();
    const getFromCache = () =>
      this.cacheRepository.getArticleByType(ARTICLE_TYPES.ABOUT);
    return this.getFromCacheIfNotEmpty(
      getFromRepo,
      getFromCache
    ) as Promise<About>;
  }

  getIndex(): Promise<Index> {
    const getFromRepo = () => this.cacheSourceArticleRepository.getIndex();
    const getFromCache = () =>
      this.cacheRepository.getArticleByType(ARTICLE_TYPES.INDEX);
    return this.getFromCacheIfNotEmpty(
      getFromRepo,
      getFromCache
    ) as Promise<Index>;
  }

  getUsageInstructions(): Promise<UsageInstructions> {
    const getFromRepo = () =>
      this.cacheSourceArticleRepository.getUsageInstructions();
    const getFromCache = () =>
      this.cacheRepository.getArticleByType(ARTICLE_TYPES.USAGE_INSTRUCTIONS);
    return this.getFromCacheIfNotEmpty(
      getFromRepo,
      getFromCache
    ) as Promise<UsageInstructions>;
  }

  async getAllSearchable(): Promise<SearchableArticle[]> {
    const getFromRepo = () =>
      this.cacheSourceArticleRepository.getAllSearchable();
    try {
      if (await this.cacheRepository.isEmpty()) return await getFromRepo();
      const cachedSearchableArticles =
        await this.cacheRepository.getAllSearchable();
      if (cachedSearchableArticles.length === 0) return await getFromRepo();
      return cachedSearchableArticles.map((article) => ({
        ...article,
        body: this.sanitizeHtml(article.body),
      }));
    } catch (e) {
      return getFromRepo();
    }
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
