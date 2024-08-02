import { ejs } from '@/vendor/ejs';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';
import type { Article, ArticleRenderer } from '@/domain/models/Article';

class EjsArticleRenderer implements ArticleRenderer {
  prepareTemplate: Promise<ejs.TemplateFunction>;

  constructor(fileSystem: FileSystem) {
    this.prepareTemplate = this.init(fileSystem);
  }

  private async init(fileSystem: FileSystem) {
    const templateText = await fileSystem.getAssetAsString(
      require('@/infrastructure/rendering/ejs/EjsArticleRenderer/template.ejs')
    );
    return ejs.compile(templateText);
  }

  async render(a: Article) {
    const template = await this.prepareTemplate;
    return template({ title: a.title, body: a.body.html });
  }

  static $inject = ['fileSystem'];
}

export { EjsArticleRenderer };
