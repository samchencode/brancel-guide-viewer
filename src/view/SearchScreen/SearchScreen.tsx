import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import { Header } from '@/view/SearchScreen/Header';
import type { SearchArticlesAction } from '@/application/SearchArticlesAction';
import { debounceFactory } from '@/view/SearchScreen/debounceFactory';
import { ResultList } from '@/view/SearchScreen/ResultList';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { ProgressIndicatorView } from '@/view/SearchScreen/ProgressIndicatorView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';

type Props = AppNavigationProps<'SearchScreen'>;

function factory(searchArticlesAction: SearchArticlesAction) {
  const debounce = debounceFactory(500);

  return function SearchScreen({ navigation }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const handlePressBack = useCallback(
      () => navigation.goBack(),
      [navigation]
    );

    const handlePressClear = useCallback(() => setSearchQuery(''), []);

    const handleSelectResult = useCallback(
      ({ article }: ArticleSearchResult) => {
        navigation.navigate('ArticleScreen', {
          idOrSectionId: article.id,
          type: 'base',
        });
      },
      [navigation]
    );

    const reactQuery = useQuery({
      queryKey: ['search', searchQuery],
      queryFn: () =>
        debounce().then(() => searchArticlesAction.execute(searchQuery)),
    });

    return (
      <View style={styles.container}>
        <Header
          value={searchQuery}
          onChangeValue={setSearchQuery}
          onPressBack={handlePressBack}
          onPressClear={handlePressClear}
        />
        <UseQueryResultView
          query={reactQuery}
          renderError={useCallback(
            (e: unknown) => (
              <Text>Error: {String(e)}</Text>
            ),
            []
          )}
          renderData={useCallback(
            (results: ArticleSearchResult[]) => (
              <ResultList
                results={results}
                onSelectResult={handleSelectResult}
              />
            ),
            [handleSelectResult]
          )}
          renderLoading={useCallback(
            () => (
              <ProgressIndicatorView />
            ),
            []
          )}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Constants.statusBarHeight,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
