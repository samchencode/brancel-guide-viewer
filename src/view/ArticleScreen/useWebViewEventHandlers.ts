import { ARTICLE_TYPES } from '@/domain/models/Article';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEventHandler';
import type { AppNavigationProps } from '@/view/Router';
import { useMemo } from 'react';

type Navigation = AppNavigationProps<'ArticleScreen'>['navigation'];

function useWebViewEventHandlers(navigation: Navigation) {
  return useMemo(
    () =>
      new WebViewEventHandler({
        handleLinkPressed(e) {
          const href = e.data.href.replace(/^about:blank/, '');
          if (href[0] !== '#')
            throw Error(
              `Linking to external webpage is not implemented! Got ${e.data.href}`
            );
          const nextId = href.slice(1);
          navigation.navigate('ArticleScreen', {
            idOrSectionId: nextId,
            type: ARTICLE_TYPES.BASE,
          });
        },
        handleIndexPressed() {
          navigation.navigate('IndexModal');
        },
        handleTableOfContentsPressed() {
          navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
        },
      }),
    [navigation]
  );
}

export { useWebViewEventHandlers };
