import type { ServiceDeclaration } from 'didi';
import { factory as App } from '@/view/App';
import { factory as Router } from '@/view/Router';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleScreen } from '@/view/ArticleScreen';
import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import { RenderArticleAction } from '@/application/RenderArticleAction';
import { ExpoAssetFileSystem } from '@/infrastructure/file-system/expo/ExpoFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer/EjsArticleRenderer';
import { RenderArticleByIdAndReplaceImagesAction } from '@/application/RenderArticleByIdAndReplaceImagesAction';
import { sanitizeHtml } from '@/infrastructure/html-manipulation/sanitize-html/sanitizeHtml';
import { getImageUrisFromHtml } from '@/infrastructure/html-manipulation/cheerio/getImageUrisFromHtml';
import {
  replaceImageUrisInHtml,
  replaceImageUrisInHtmlBody,
} from '@/infrastructure/html-manipulation/cheerio/replaceImageUrisInHtml';
import { factory as replaceImageUrisWithBase64InHtml } from '@/infrastructure/html-manipulation/fetch/replaceImageUrisWithBase64InHtml';
import { FakeGuideArticleRepository } from '@/infrastructure/persistence/fake/FakeGuideArticleRepository';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';

type Module = {
  [key: string]: ServiceDeclaration<unknown>;
};

export const module: Module = {
  // CONFIG
  guideName: ['value', 'Urgent Care Medicine'],
  wpApiHostUrl: ['value', 'http://localhost:8080'],
  wpApiPageId: ['value', '27'],

  // ACTIONS
  getAllArticlesAction: ['type', GetAllArticlesAction],
  getArticleByIdAction: ['type', GetArticleByIdAction],
  renderArticleAction: ['type', RenderArticleAction],
  renderArticleByIdAndReplaceImagesAction: [
    'type',
    RenderArticleByIdAndReplaceImagesAction,
  ],

  // INFRASTRUCTURE
  articleRepository: ['type', FakeGuideArticleRepository],
  articleRenderer: ['type', EjsArticleRenderer],
  fileSystem: ['type', ExpoAssetFileSystem],
  guideParser: ['type', CheerioGuideParser],

  // INFRASTRUCTURE -> html-manipulation
  sanitizeHtml: ['value', sanitizeHtml],
  getImageUrisFromHtml: ['value', getImageUrisFromHtml],
  replaceImageUrisInHtml: ['value', replaceImageUrisInHtml],
  replaceImageUrisInHtmlBody: ['value', replaceImageUrisInHtmlBody],
  replaceImageUrisWithBase64InHtml: [
    'factory',
    replaceImageUrisWithBase64InHtml,
  ],

  // TEMPLATES
  App: ['factory', App],
  Router: ['factory', Router],
  HomeScreen: ['factory', HomeScreen],
  ArticleScreen: ['factory', ArticleScreen],

  // CORE
  fetch: ['value', fetch],
};
