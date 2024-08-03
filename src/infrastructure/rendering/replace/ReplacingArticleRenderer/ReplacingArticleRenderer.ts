import type { Article, ArticleRenderer } from '@/domain/models/Article';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

class ReplacingArticleRenderer implements ArticleRenderer {
  getTemplate: Promise<string>;

  constructor(fileSystem: FileSystem) {
    this.getTemplate = this.init(fileSystem);
  }

  private async init(fileSystem: FileSystem) {
    return fileSystem.getAssetAsString(
      require('@/infrastructure/rendering/replace/ReplacingArticleRenderer/template.ejs')
    );
  }

  async render(a: Article) {
    const template = await this.getTemplate;
    const afterReplaceTitle = template.replace('<%= title %>', a.title);
    return afterReplaceTitle.replace('<%- body %>', a.body.html);
  }

  static $inject = ['fileSystem'];
}

export { ReplacingArticleRenderer };
