import React from 'react';
import type { Article } from '@/domain/models/Article';
import type {
  ArticleSearchResult,
  Navigation,
} from '@/view/ArticleScreen/ArticleSearchResult/ArticleSearchResult';
import { ArticleView } from '@/view/ArticleScreen/ArticleView';
import type { RenderArticleAction } from '@/application/RenderArticleAction';

class FilledArticleSearchResult implements ArticleSearchResult {
  constructor(private article: Article, private sectionId?: string) {}

  render(navigation: Navigation, renderHtml: RenderArticleAction) {
    return (
      <ArticleView
        article={this.article}
        sectionId={this.sectionId}
        navigation={navigation}
        renderArticle={renderHtml}
      />
    );
  }
}

export { FilledArticleSearchResult };
