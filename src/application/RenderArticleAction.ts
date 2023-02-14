import type { Article, ArticleRenderer } from '@/domain/models/Article';

class RenderArticleAction {
  constructor(private articleRenderer: ArticleRenderer) {}

  async execute(article: Article) {
    return this.articleRenderer.render(article);
  }
}

export { RenderArticleAction };
