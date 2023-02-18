import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';
import type { ArticleId } from '@/domain/models/Article';
import type { ReplaceImageUrisWithBase64InHtml } from '@/domain/models/RichText';

class RenderArticleByIdAndReplaceImagesAction {
  constructor(
    private getArticleByIdAction: GetArticleByIdAction,
    private renderArticleAction: RenderArticleAction,
    private replaceImageUrisWithBase64InHtml: ReplaceImageUrisWithBase64InHtml
  ) {}

  async execute(id: ArticleId) {
    const article = await this.getArticleByIdAction.execute(id);
    const rendered = await this.renderArticleAction.execute(article);
    return this.replaceImageUrisWithBase64InHtml(rendered);
  }
}

export { RenderArticleByIdAndReplaceImagesAction };
