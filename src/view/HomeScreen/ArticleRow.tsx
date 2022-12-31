import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import type { Article } from '@/domain/models/Article';
import { theme } from '@/theme';

type Props = {
  article: Article;
};

function ArticleRow({ article }: Props) {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="file" size={24} style={styles.icon} />
      <Text style={styles.title}>{article.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spaces.md,
    padingRight: theme.spaces.lg,
    paddingTop: theme.spaces.sm,
    paddingBottom: theme.spaces.sm,
    minHeight: 56,
  },
  icon: {
    marginRight: theme.spaces.md,
  },
  title: theme.fonts.bodyLarge,
});

export { ArticleRow };
