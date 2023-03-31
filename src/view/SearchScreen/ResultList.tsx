import React, { useCallback } from 'react';
import type { ListRenderItem } from 'react-native';
import { useWindowDimensions, StyleSheet, FlatList } from 'react-native';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { ResultListItem } from '@/view/SearchScreen/ResultListItem';

type Props = {
  results: ArticleSearchResult[];
  onSelectResult: (result: ArticleSearchResult) => void;
};

function ResultList({ results, onSelectResult }: Props) {
  const { height } = useWindowDimensions();

  const LIST_ITEM_HEIGHT = 56;
  const initialNumToRender = Math.ceil(height / LIST_ITEM_HEIGHT);

  const renderItem = useCallback<ListRenderItem<ArticleSearchResult>>(
    ({ item: result }) => (
      <ResultListItem result={result} onPress={onSelectResult} />
    ),
    [onSelectResult]
  );

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.article.id}
      contentContainerStyle={styles.container}
      // ListEmptyComponent={<EmptyArticleList />}
      initialNumToRender={initialNumToRender}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    //
  },
});

export { ResultList };
