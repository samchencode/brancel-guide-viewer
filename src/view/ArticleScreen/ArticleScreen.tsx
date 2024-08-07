import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import type {
  FindArticleAction,
  Result,
} from '@/application/FindArticleAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';
import { ProgressIndicatorView } from '@/view/ArticleScreen/ProgressIndicatorView';
import { ArticleView } from '@/view/ArticleScreen/ArticleView';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { useQuery } from '@tanstack/react-query';
import { ErrorView } from '@/view/ErrorView';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  findArticleAction: FindArticleAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleScreen({ route, navigation }: Props) {
    const { idOrSectionId, type, searchMatchData } = route.params;

    const query = useQuery({
      queryKey: ['article', idOrSectionId, type],
      queryFn: () => findArticleAction.execute({ idOrSectionId, type }),
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
            (res: Result) => (
              <ArticleView
                article={res.article}
                sectionId={res.sectionId}
                navigation={navigation}
                renderArticle={renderArticleAction}
                searchMatchIndicies={searchMatchData?.body}
              />
            ),
            [navigation, searchMatchData?.body]
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
  },
});

factory.$inject = ['findArticleAction', 'renderArticleAction'];

export { factory };
export type Type = ReturnType<typeof factory>;
