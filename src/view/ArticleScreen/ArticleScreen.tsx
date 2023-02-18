import React, { useEffect, useState } from 'react';
import type { AppNavigationProps } from '@/view/Router';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { theme } from '@/theme';
import type { RenderArticleByIdAndReplaceImagesAction } from '@/application/RenderArticleByIdAndReplaceImagesAction';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  renderArticleByIdAndReplaceImagesAction: RenderArticleByIdAndReplaceImagesAction
) {
  return function ArticleScreen({ route }: Props) {
    const { id } = route.params;

    const [html, setHtml] = useState<string>('');
    useEffect(() => {
      renderArticleByIdAndReplaceImagesAction
        .execute(id)
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
