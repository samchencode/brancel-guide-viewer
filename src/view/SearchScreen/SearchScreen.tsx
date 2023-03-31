import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import { Header } from '@/view/SearchScreen/Header';
import type { SearchArticlesAction } from '@/application/SearchArticlesAction';
import { debounceFactory } from '@/view/SearchScreen/debounceFactory';
import { usePromise } from '@/view/lib/usePromise';
import { ResultList } from '@/view/SearchScreen/ResultList';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { ProgressIndicatorView } from '@/view/SearchScreen/ProgressIndicatorView';

type Props = AppNavigationProps<'SearchScreen'>;

function factory(searchArticlesAction: SearchArticlesAction) {
  const debounce = debounceFactory(500);

  return function SearchScreen({ navigation }: Props) {
    const [query, setQuery] = useState('');

    const handlePressBack = useCallback(
      () => navigation.goBack(),
      [navigation]
    );

    const handlePressClear = useCallback(() => setQuery(''), []);

    const handleSelectResult = useCallback(
      ({ article }: ArticleSearchResult) => {
        navigation.navigate('ArticleScreen', {
          idOrSectionId: article.id,
          type: 'base',
        });
      },
      [navigation]
    );

    const promise = useMemo(
      () => debounce().then(() => searchArticlesAction.execute(query)),
      [query]
    );

    const render = usePromise(promise, {
      renderLoadingState: useCallback(() => <ProgressIndicatorView />, []),
      renderFinishedState: useCallback(
        (results) => (
          <ResultList results={results} onSelectResult={handleSelectResult} />
        ),
        [handleSelectResult]
      ),
      renderErrorState: useCallback((e: Error) => <Text>{String(e)}</Text>, []),
    });

    return (
      <View style={styles.container}>
        <Header
          value={query}
          onChangeValue={setQuery}
          onPressBack={handlePressBack}
          onPressClear={handlePressClear}
        />
        {render()}
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
