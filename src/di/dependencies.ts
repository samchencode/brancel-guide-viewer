import type { ServiceDeclaration } from 'didi';
import { factory as App } from '@/view/App';
import { factory as Router } from '@/view/Router';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleScreen } from '@/view/ArticleScreen';
import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import { RenderArticleAction } from '@/application/RenderArticleAction';
import { ExpoAssetFileSystem } from '@/infrastructure/file-system/expo/ExpoFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer/EjsArticleRenderer';

type Module = {
  [key: string]: ServiceDeclaration<unknown>;
};

export const module: Module = {
  // ACTIONS
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getArticleByIdAction: ['type', GetArticleByIdAction],
  renderArticleAction: ['type', RenderArticleAction],

  // INFRASTRUCTURE
  articleRepository: ['type', FakeArticleRepository],
  articleRenderer: ['type', EjsArticleRenderer],
  fileSystem: ['type', ExpoAssetFileSystem],

  // TEMPLATES
  App: ['factory', App],
  Router: ['factory', Router],
  HomeScreen: ['factory', HomeScreen],
  ArticleScreen: ['factory', ArticleScreen],
};
