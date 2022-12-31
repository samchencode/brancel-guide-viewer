import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Article } from '@/domain/models/Article';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';
import { ArticleList } from '@/view/HomeScreen/ArticleList';
import { theme } from '@/theme';

function factory(getAllArticlesAction: GetAllArticlesAction) {
  return function HomeScreen() {
    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => {
      getAllArticlesAction.execute().then((a) => setArticles(a));
    }, []);

    return (
      <View style={styles.container}>
        <ArticleList articles={articles} />
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
