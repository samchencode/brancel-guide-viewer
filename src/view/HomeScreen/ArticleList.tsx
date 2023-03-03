import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { ArticleRow } from '@/view/HomeScreen/ArticleRow';
import { theme } from '@/theme';
import type { TableOfContentsItem } from '@/domain/models/TableOfContents';
import { EmptyArticleList } from '@/view/HomeScreen/EmptyArticleList';

type Props = {
  articles: TableOfContentsItem[];
  onSelectArticle: (dest: string) => void;
};

function getKey(item: TableOfContentsItem) {
  return item.destination;
}

function ArticleList({ articles, onSelectArticle }: Props) {
  return (
    <FlatList
      data={articles}
      renderItem={useCallback<ListRenderItem<TableOfContentsItem>>(
        ({ item: article }) => (
          <ArticleRow article={article} onPress={onSelectArticle} />
        ),
        [onSelectArticle]
      )}
      keyExtractor={getKey}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={<EmptyArticleList />}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginTop: theme.spaces.sm,
    marginBottom: theme.spaces.sm,
  },
});

export { ArticleList };
