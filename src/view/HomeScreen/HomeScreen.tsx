import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArticleList } from '@/view/HomeScreen/ArticleList';
import { theme } from '@/theme';
import type { AppNavigationProps } from '@/view/Router';
import type { GetTableOfContentsAction } from '@/application/GetTableOfContentsAction';
import { ARTICLE_TYPES } from '@/domain/models/Article';
import { ProgressIndicatorView } from '@/view/HomeScreen/ProgressIndicatorView';
import { SearchBar } from '@/view/HomeScreen/SearchBar';
import {
  seenDisclaimerBefore,
  setSeenDisclaimerBefore,
} from '@/view/HomeScreen/seenDisclaimerBefore';
import { useQuery } from '@tanstack/react-query';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import type { TableOfContents } from '@/domain/models/TableOfContents';
import { ErrorView } from '@/view/ErrorView';

type Props = AppNavigationProps<'HomeScreen'>;

function factory(getTableOfContentsAction: GetTableOfContentsAction) {
  const seenDisclaimer = seenDisclaimerBefore();

  return function HomeScreen({ navigation }: Props) {
    useEffect(() => {
      seenDisclaimer.then((seen) => {
        if (!seen) navigation.navigate('DisclaimerModal');
        return setSeenDisclaimerBefore();
      });
    }, [navigation]);

    const onSelectArticle = useCallback(
      (destination: string) => {
        navigation.navigate('ArticleScreen', {
          idOrSectionId: destination,
          type: ARTICLE_TYPES.BASE,
        });
      },
      [navigation]
    );

    const onPressSearch = useCallback(
      () => navigation.navigate('SearchScreen'),
      [navigation]
    );

    const query = useQuery({
      queryKey: ['table-of-contents'],
      queryFn: () => getTableOfContentsAction.execute(),
    });

    return (
      <View style={styles.container}>
        <UseQueryResultView
          query={query}
          renderError={useCallback(
            (e) => (
              <ErrorView error={e} />
            ),
            []
          )}
          renderData={useCallback(
            (toc: TableOfContents) => (
              <ArticleList
                articles={toc.items ?? []}
                onSelectArticle={onSelectArticle}
                ListHeaderComponent={
                  <SearchBar style={styles.searchBar} onPress={onPressSearch} />
                }
              />
            ),
            [onPressSearch, onSelectArticle]
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

factory.$inject = ['getTableOfContentsAction'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    margin: theme.spaces.md,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
