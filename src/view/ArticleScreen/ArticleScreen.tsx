import React, { useEffect, useState } from 'react';
import type { AppNavigationProps } from '@/view/Router';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { theme } from '@/theme';
import type { GetArticleByIdAction } from '@/application/GetArticleByIdAction';
import type { Article } from '@/domain/models/Article';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(getArticleByIdAction: GetArticleByIdAction) {
  return function ArticleScreen({ route }: Props) {
    const { id } = route.params;

    const [article, setArticle] = useState<Article | null>(null);
    useEffect(() => {
      getArticleByIdAction.execute(id).then((a) => setArticle(a));
    }, [id]);

    return (
      <View style={styles.container}>
        {article && <WebView source={{ html: article.body.html }} />}
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
