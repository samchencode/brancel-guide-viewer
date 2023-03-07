import React from 'react';
import type { ArticleSearchResult } from '@/view/ArticleScreen/ArticleSearchResult/ArticleSearchResult';
import { EmptyArticleView } from '@/view/ArticleScreen/EmptyArticleView';

class NullArticleSearchResult implements ArticleSearchResult {
  render() {
    return <EmptyArticleView />;
  }
}

export { NullArticleSearchResult };
