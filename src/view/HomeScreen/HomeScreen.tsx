import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArticleList } from '@/view/HomeScreen/ArticleList';
import { theme } from '@/theme';
import type { AppNavigationProps } from '@/view/Router';
import type { GetTableOfContentsAction } from '@/application/GetTableOfContentsAction';
import { ARTICLE_TYPES } from '@/domain/models/Article';
import { usePromise } from '@/view/lib/usePromise';
import { ProgressIndicatorView } from '@/view/HomeScreen/ProgressIndicatorView';
import { SearchBar } from '@/view/HomeScreen/SearchBar';
import {
  seenDisclaimerBefore,
  setSeenDisclaimerBefore,
} from '@/view/HomeScreen/seenDisclaimerBefore';

type Props = AppNavigationProps<'HomeScreen'>;

function factory(getTableOfContentsAction: GetTableOfContentsAction) {
  const get = getTableOfContentsAction.execute();

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

    const render = usePromise(get, {
      renderFinishedState: useCallback(
        (toc) => (
          <ArticleList
            articles={toc.items ?? []}
            onSelectArticle={onSelectArticle}
            ListHeaderComponent={
              <SearchBar style={styles.searchBar} onPress={onPressSearch} />
            }
          />
        ),
        [onPressSearch, onSelectArticle]
      ),
      renderLoadingState: useCallback(() => <ProgressIndicatorView />, []),
    });

    return <View style={styles.container}>{render()}</View>;
  };
}

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
