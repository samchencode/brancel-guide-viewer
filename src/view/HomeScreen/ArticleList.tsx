import React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { ArticleRow } from '@/view/HomeScreen/ArticleRow';
import type { Article } from '@/domain/models/Article';
import { theme } from '@/theme';

type Props = {
  articles: Article[];
};

const renderRow: ListRenderItem<Article> = ({ item: article }) => (
  <ArticleRow article={article} />
);

function getKey(article: Article) {
  return article.id.toString();
}

function ArticleList({ articles }: Props) {
  return (
    <FlatList
      data={articles}
      renderItem={renderRow}
      keyExtractor={getKey}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spaces.sm,
    marginBottom: theme.spaces.sm,
  },
});

export { ArticleList };
