import type { GetArticleByTypeAction } from '@/application/GetArticleByTypeAction';
import type { Article, ArticleRepository } from '@/domain/models/Article';
import { ARTICLE_TYPES, ArticleId } from '@/domain/models/Article';

type ValueOf<T> = T[keyof T];
type ArticleType = ValueOf<typeof ARTICLE_TYPES>;

type TypeSearchParams = {
  idOrSectionId?: string;
  type: Exclude<ArticleType, typeof ARTICLE_TYPES.BASE>;
};
type IdOrSectionIdSearchParams = {
  idOrSectionId: string;
  type: typeof ARTICLE_TYPES.BASE;
};
type SearchParams = TypeSearchParams | IdOrSectionIdSearchParams;

type Result = {
  article: Article;
  sectionId?: string;
};

class FindArticleAction {
  constructor(
    private articleRepository: ArticleRepository,
    private getArticleByTypeAction: GetArticleByTypeAction
  ) {}

  async execute({ idOrSectionId, type }: SearchParams): Promise<Result> {
    if (type !== ARTICLE_TYPES.BASE)
      return this.findByType(type, idOrSectionId);

    const byArticleId = await this.findByArticleId(idOrSectionId);
    if (byArticleId) return byArticleId;

    return this.findBySectionId(idOrSectionId);
  }

  private async findByArticleId(idString: string): Promise<Result | undefined> {
    const id = new ArticleId(idString);
    try {
      const article = await this.articleRepository.getById(id);
      return { article };
    } catch (e) {
      return undefined;
    }
  }

  private async findBySectionId(sectionId: string): Promise<Result> {
    const bySectionId = await this.articleRepository.getBySectionId(sectionId);
    return { article: bySectionId, sectionId };
  }

  private async findByType(
    type: Exclude<ArticleType, typeof ARTICLE_TYPES.BASE>,
    sectionId?: string
  ): Promise<Result> {
    const article = await this.getArticleByTypeAction.execute(type);
    return { article, sectionId };
  }
}

export { FindArticleAction };
