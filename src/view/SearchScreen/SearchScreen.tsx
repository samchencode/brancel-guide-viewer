import React, { useCallback, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Constants from 'expo-constants';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import { Header } from '@/view/SearchScreen/Header';
import type { SearchArticlesAction } from '@/application/SearchArticlesAction';
import { debounceFactory } from '@/view/SearchScreen/debounceFactory';
import { ResultList } from '@/view/SearchScreen/ResultList';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { SearchLoading } from '@/view/SearchScreen/ProgressIndicatorView';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { ErrorView } from '@/view/ErrorView';

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
      ({ article, matchData }: ArticleSearchResult) => {
        navigation.navigate('ArticleScreen', {
          idOrSectionId: article.id,
          type: 'base',
          searchMatchData: matchData,
        });
      },
      [navigation]
    );

    const reactQuery = useQuery({
      queryKey: ['search', searchQuery],
      queryFn: () =>
        debounce().then(() => searchArticlesAction.execute(searchQuery)),
      enabled: searchQuery !== '',
    });

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        // behavior of a View avoids keyboard better in Android
        enabled={Platform.OS === 'ios'}
      >
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
              <ErrorView error={e} />
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
              <SearchLoading hasQuery={searchQuery !== ''} />
            ),
            [searchQuery]
          )}
        />
      </KeyboardAvoidingView>
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
