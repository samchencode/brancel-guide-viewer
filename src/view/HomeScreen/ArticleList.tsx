import React, { useCallback, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { ArticleRow } from '@/view/HomeScreen/ArticleRow';
import { theme } from '@/theme';
import type { TableOfContentsItem } from '@/domain/models/TableOfContents';
import { EmptyArticleList } from '@/view/HomeScreen/EmptyArticleList';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  articles: TableOfContentsItem[];
  onSelectArticle: (dest: string) => void;
  ListHeaderComponent?: JSX.Element;
};

function getKey(item: TableOfContentsItem) {
  return item.destination;
}

function ArticleList({
  articles,
  onSelectArticle,
  ListHeaderComponent = undefined,
}: Props) {
  const { height } = useWindowDimensions();
  const LIST_ITEM_HEIGHT = 56;
  const initialNumToRender = Math.ceil(height / LIST_ITEM_HEIGHT);

  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(() => {
    if (!flatListRef.current) return;
    flatListRef.current.scrollToOffset({
      offset: 0,
      animated: false,
    });
  });

  const insets = useSafeAreaInsets();

  return (
    <FlatList
      ref={flatListRef}
      data={articles}
      renderItem={useCallback<ListRenderItem<TableOfContentsItem>>(
        ({ item: article }) => (
          <ArticleRow article={article} onPress={onSelectArticle} />
        ),
        [onSelectArticle]
      )}
      keyExtractor={getKey}
      contentContainerStyle={[
        styles.contentContainerStyle,
        { paddingBottom: Math.max(theme.spaces.sm, insets.bottom) },
      ]}
      ListEmptyComponent={<EmptyArticleList />}
      ListHeaderComponent={ListHeaderComponent}
      initialNumToRender={initialNumToRender}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    marginTop: theme.spaces.sm,
  },
});

export { ArticleList };
