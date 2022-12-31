import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { ArticleRow } from '@/view/HomeScreen/ArticleRow';
import type { Article, ArticleId } from '@/domain/models/Article';
import { theme } from '@/theme';

type Props = {
  articles: Article[];
  onSelectArticle: (id: ArticleId) => void;
};

function getKey(article: Article) {
  return article.id.toString();
}

function ArticleList({ articles, onSelectArticle }: Props) {
  return (
    <FlatList
      data={articles}
      renderItem={useCallback<ListRenderItem<Article>>(
        ({ item: article }) => (
          <ArticleRow article={article} onPress={onSelectArticle} />
        ),
        [onSelectArticle]
      )}
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
