import type { Article, ArticleRenderer } from '@/domain/models/Article';
import type { ReplaceImageUrisWithBase64InHtml } from '@/domain/models/RichText';

class RenderArticleAction {
  constructor(
    private articleRenderer: ArticleRenderer,
    private replaceImageUrisWithBase64InHtml: ReplaceImageUrisWithBase64InHtml
  ) {}

  async execute(article: Article) {
    const html = await this.articleRenderer.render(article);
    return this.replaceImageUrisWithBase64InHtml(html);
  }
}

export { RenderArticleAction };
