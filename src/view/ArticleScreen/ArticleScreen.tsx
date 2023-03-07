import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import type { FindArticleAction } from '@/application/FindArticleAction';
import type { RenderArticleAction } from '@/application/RenderArticleAction';
import type { ArticleSearchResult } from '@/view/ArticleScreen/ArticleSearchResult';
import {
  FilledArticleSearchResult,
  NullArticleSearchResult,
} from '@/view/ArticleScreen/ArticleSearchResult';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory(
  findArticleAction: FindArticleAction,
  renderArticleAction: RenderArticleAction
) {
  return function ArticleScreen({ route, navigation }: Props) {
    const { idOrSectionId, type } = route.params;

    const [result, setResult] = useState<ArticleSearchResult>(
      new NullArticleSearchResult()
    );
    useEffect(() => {
      findArticleAction
        .execute({ idOrSectionId, type })
        .then((r) =>
          setResult(new FilledArticleSearchResult(r.article, r.sectionId))
        );
    }, [idOrSectionId, type]);

    return (
      <View style={styles.container}>
        {result.render(navigation, renderArticleAction)}
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

export { factory };
export type Type = ReturnType<typeof factory>;
