import type { ArticleType } from '@/domain/models/Article';
import { CachedArticleImage } from '@/infrastructure/persistence/cache/CacheArticleRepository/CachedArticleImage';

class CachedArticle {
  public readonly cachedImages: CachedArticleImage[];

  public readonly sectionIds: string[];

  constructor(
    public readonly idString: string,
    public readonly title: string,
    public readonly bodyHtml: string,
    public readonly articleType: ArticleType,
    sectionIdsJson: string,
    cachedImagesJson: string
  ) {
    this.cachedImages = CachedArticleImage.fromJsonArray(cachedImagesJson);
    this.sectionIds = JSON.parse(sectionIdsJson);
  }
}

export { CachedArticle };
