import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';
import type { TableOfContentsItem } from '@/domain/models/TableOfContents';

type Props = {
  article: TableOfContentsItem;
  onPress: (dest: string) => void;
};

class ArticleRow extends PureComponent<Props> {
  handlePress = () => {
    const { onPress, article } = this.props;
    onPress(article.destination);
  };

  render() {
    const { article } = this.props;

    return (
      <TouchableHighlight
        underlayColor={theme.colors.opacity(0.12).onSurface}
        onPress={this.handlePress}
      >
        <View style={styles.contentContainer}>
          <FontAwesome5 name="file" size={24} style={styles.icon} />
          <Text style={styles.title}>{article.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
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
