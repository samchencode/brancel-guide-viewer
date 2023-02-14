import type { ServiceDeclaration } from 'didi';
import { factory as App } from '@/view/App';
import { factory as Router } from '@/view/Router';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleScreen } from '@/view/ArticleScreen';
import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { FakeArticleRepository } from '@/infrastructure/persistence/fake/FakeArticleRepository';
import { GetArticleByIdAction } from '@/application/GetArticleByIdAction';

type Module = {
  [key: string]: ServiceDeclaration<unknown>;
};

export const module: Module = {
  // ACTIONS
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getArticleByIdAction: ['type', GetArticleByIdAction],

  // INFRASTRUCTURE
  articleRepository: ['type', FakeArticleRepository],

  // TEMPLATES
  App: ['factory', App],
  Router: ['factory', Router],
  HomeScreen: ['factory', HomeScreen],
  ArticleScreen: ['factory', ArticleScreen],
};
