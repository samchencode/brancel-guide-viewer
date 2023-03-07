import React, { useCallback, useEffect, useState } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import type { Article } from '@/domain/models/Article';
import { useWebViewEventHandlers } from '@/view/ArticleScreen/useWebViewEventHandlers';
import type { AppNavigationProps } from '@/view/Router';
import type { RenderArticleAction } from '@/application/RenderArticleAction';

type Navigation = AppNavigationProps<'ArticleScreen'>['navigation'];

type Props = {
  article: Article;
  sectionId?: string;
  renderArticle: RenderArticleAction;
  navigation: Navigation;
};

function makeHashAddScript(sectionId: string) {
  return `window.location = '#${sectionId}';`;
}

function ArticleView({
  article,
  renderArticle,
  navigation,
  sectionId = undefined,
}: Props) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    renderArticle.execute(article).then((h) => setHtml(h));
  }, [article, renderArticle]);

  const handler = useWebViewEventHandlers(navigation);

  const handleMessage = useCallback(
    (m: WebViewMessageEvent) => handler.handleMessage(m.nativeEvent.data),
    [handler]
  );

  return (
    <WebView
      source={{ html }}
      onMessage={handleMessage}
      injectedJavaScript={sectionId && makeHashAddScript(sectionId)}
    />
  );
}

export { ArticleView };
