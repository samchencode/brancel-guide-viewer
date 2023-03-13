import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import type { FindArticleAction } from '@/application/FindArticleAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';
import { usePromise } from '@/view/lib/usePromise';
import { ProgressIndicatorView } from '@/view/ArticleScreen/ProgressIndicatorView';
import { ArticleView } from '@/view/ArticleScreen/ArticleView';
import { EmptyArticleView } from '@/view/ArticleScreen/EmptyArticleView';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  findArticleAction: FindArticleAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleScreen({ route, navigation }: Props) {
    const { idOrSectionId, type } = route.params;

    const promise = useMemo(
      () => findArticleAction.execute({ idOrSectionId, type }),
      [idOrSectionId, type]
    );

    const render = usePromise(promise, {
      renderFinishedState: useCallback(
        (res) => (
          <ArticleView
            article={res.article}
            sectionId={res.sectionId}
            navigation={navigation}
            renderArticle={renderArticleAction}
          />
        ),
        [navigation]
      ),
      renderLoadingState: useCallback(() => <ProgressIndicatorView />, []),
      renderErrorState: useCallback(() => <EmptyArticleView />, []),
    });

    return <View style={styles.container}>{render()}</View>;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
