import type { Article } from '@/domain/models/Article/Article';
import type { ArticleId } from '@/domain/models/Article/ArticleId';

interface ArticleRepository {
  getAll(): Promise<Article[]>;
  getById(id: ArticleId): Promise<Article>;
}

export { ArticleRepository };
