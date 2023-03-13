import type { ServiceDeclaration } from 'didi';
import { factory as App } from '@/view/App';
import { factory as Router } from '@/view/Router';
import { factory as HomeScreen } from '@/view/HomeScreen';
import { factory as ArticleScreen } from '@/view/ArticleScreen';
import { factory as UsageInstructionsScreen } from '@/view/UsageInstructionsScreen';
import { factory as LicenseScreen } from '@/view/LicenseScreen';
import { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import { RenderArticleAction } from '@/application/RenderArticleAction';
import { ExpoAssetFileSystem } from '@/infrastructure/file-system/expo/ExpoFileSystem';
import { EjsArticleRenderer } from '@/infrastructure/rendering/ejs/EjsArticleRenderer/EjsArticleRenderer';
import { sanitizeHtml } from '@/infrastructure/html-manipulation/sanitize-html/sanitizeHtml';
import { getImageUrisFromHtml } from '@/infrastructure/html-manipulation/cheerio/getImageUrisFromHtml';
import {
  replaceImageUrisInHtml,
  replaceImageUrisInHtmlBody,
} from '@/infrastructure/html-manipulation/cheerio/replaceImageUrisInHtml';
import { factory as replaceImageUrisWithBase64InHtml } from '@/infrastructure/html-manipulation/fake/replaceImageUrisWithBase64InHtml';
import { GuideArticleRepository } from '@/infrastructure/persistence/guide/GuideArticleRepository';
import { CheerioGuideParser } from '@/infrastructure/parsing/cheerio/CheerioGuideParser';
import { FakeGuideRepository } from '@/infrastructure/persistence/fake/FakeGuideRepository';
import { GuideTableOfContentsRepository } from '@/infrastructure/persistence/guide/GuideTableOfContentsRepository';
import { GetTableOfContentsAction } from '@/application/GetTableOfContentsAction';
import { FindArticleAction } from '@/application/FindArticleAction';
import { GetArticleBySectionIdAction } from '@/application/GetArticleBySectionIdAction';
import { GetArticleByTypeAction } from '@/application/GetArticleByTypeAction';

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
  getArticleBySectionIdAction: ['type', GetArticleBySectionIdAction],
  getArticleByTypeAction: ['type', GetArticleByTypeAction],
  getTableOfContentsAction: ['type', GetTableOfContentsAction],
  findArticleAction: ['type', FindArticleAction],
  renderArticleAction: ['type', RenderArticleAction],

  // INFRASTRUCTURE
  articleRepository: ['type', GuideArticleRepository],
  articleRenderer: ['type', EjsArticleRenderer],
  guideRepository: ['type', FakeGuideRepository],
  tableOfContentsRepository: ['type', GuideTableOfContentsRepository],
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
  UsageInstructionsScreen: ['factory', UsageInstructionsScreen],
  LicenseScreen: ['factory', LicenseScreen],

  // CORE
  fetch: ['value', fetch],
};
