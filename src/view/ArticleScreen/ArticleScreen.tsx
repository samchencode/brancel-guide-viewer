import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import type { GetArticleByIdOrSectionIdAction } from '@/application/GetArticleByIdOrSectionIdAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';
import { WebViewEventHandler } from '@/infrastructure/rendering/WebViewEventHandler';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  getArticleByIdOrSectionIdAction: GetArticleByIdOrSectionIdAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleScreen({ route, navigation }: Props) {
    const { id } = route.params;

    const [html, setHtml] = useState<string>('');
    useEffect(() => {
      getArticleByIdOrSectionIdAction
        .execute(id)
        .then((a) => renderArticleAction.execute(a))
        .then((h) => setHtml(h));
    }, [id]);

    const handler = useMemo(
      () =>
        new WebViewEventHandler({
          handleLinkPressed(e) {
            const href = e.data.href.replace(/^about:blank/, '');
            if (href[0] !== '#')
              throw Error(
                `Linking to external webpage is not implemented! Got:${e.data.href}`
              );
            const nextId = href.slice(1);
            navigation.navigate('ArticleScreen', { id: nextId });
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

    const handleMessage = useCallback(
      (m: WebViewMessageEvent) => handler.handleMessage(m.nativeEvent.data),
      [handler]
    );

    return (
      <View style={styles.container}>
        <WebView source={{ html }} onMessage={handleMessage} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
