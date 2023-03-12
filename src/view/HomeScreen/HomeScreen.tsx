import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArticleList } from '@/view/HomeScreen/ArticleList';
import { theme } from '@/theme';
import type { AppNavigationProps } from '@/view/Router';
import type { GetTableOfContentsAction } from '@/application/GetTableOfContentsAction';
import type { TableOfContents } from '@/domain/models/TableOfContents';
import { ARTICLE_TYPES } from '@/domain/models/Article';

type Props = AppNavigationProps<'HomeScreen'>;

function factory(getTableOfContentsAction: GetTableOfContentsAction) {
  return function HomeScreen({ navigation }: Props) {
    const [toc, setToc] = useState<TableOfContents | null>(null);
    useEffect(() => {
      getTableOfContentsAction.execute().then((v) => setToc(v));
    }, []);

    const onSelectArticle = useCallback(
      (destination: string) => {
        navigation.navigate('ArticleScreen', {
          idOrSectionId: destination,
          type: ARTICLE_TYPES.BASE,
        });
      },
      [navigation]
    );

    return (
      <View style={styles.container}>
        <ArticleList
          articles={toc?.items ?? []}
          onSelectArticle={onSelectArticle}
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

export { factory };
export type Type = ReturnType<typeof factory>;
