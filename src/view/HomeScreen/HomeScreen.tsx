import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { ArticleList } from '@/view/HomeScreen/ArticleList';
import { theme } from '@/theme';
import type { AppNavigationProps } from '@/view/Router';

type Props = AppNavigationProps<'HomeScreen'>;

function factory(getAllArticlesAction: GetAllArticlesAction) {
  return function HomeScreen({ navigation }: Props) {
    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => {
      getAllArticlesAction.execute().then((a) => setArticles(a));
    }, []);

    const onSelectArticle = useCallback(
      (id: ArticleId) => {
        navigation.navigate('ArticleScreen', { id });
      },
      [navigation]
    );

    return (
      <View style={styles.container}>
        <ArticleList articles={articles} onSelectArticle={onSelectArticle} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
