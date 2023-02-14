import React, { useEffect, useState } from 'react';
import type { AppNavigationProps } from '@/view/Router';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { theme } from '@/theme';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  getArticleByIdAction: GetArticleByIdAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleScreen({ route }: Props) {
    const { id } = route.params;

    const [html, setHtml] = useState<string>('');
    useEffect(() => {
      getArticleByIdAction
        .execute(id)
        .then((a) => renderArticleAction.execute(a))
        .then((h) => setHtml(h));
    }, [id]);

    return (
      <View style={styles.container}>
        <WebView source={{ html }} />
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
