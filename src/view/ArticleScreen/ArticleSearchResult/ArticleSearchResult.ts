import type { RenderArticleAction } from '@/application/RenderArticleAction';
import type { AppNavigationProps } from '@/view/Router';

type Navigation = AppNavigationProps<'ArticleScreen'>['navigation'];

interface ArticleSearchResult {
  render(navigation: Navigation, renderHtml: RenderArticleAction): JSX.Element;
}

export type { ArticleSearchResult, Navigation };
