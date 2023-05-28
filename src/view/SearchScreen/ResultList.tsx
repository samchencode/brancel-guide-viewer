import React, { useCallback } from 'react';
import type { ListRenderItem } from 'react-native';
import { useWindowDimensions, StyleSheet, FlatList } from 'react-native';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { ResultListItem } from '@/view/SearchScreen/ResultListItem';
import { EmptyResultList } from '@/view/SearchScreen/EmptyResultList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

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

  const insets = useSafeAreaInsets();

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.article.id}
      ListEmptyComponent={<EmptyResultList />}
      initialNumToRender={initialNumToRender}
      contentContainerStyle={[
        results.length === 0 && styles.emptyContentContainer,
        { paddingBottom: Math.max(theme.spaces.sm, insets.bottom) },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  emptyContentContainer: {
    flex: 1,
  },
});

export { ResultList };
