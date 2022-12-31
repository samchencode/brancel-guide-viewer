import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import type { Article, ArticleId } from '@/domain/models/Article';
import { theme } from '@/theme';

type Props = {
  article: Article;
  onPress: (id: ArticleId) => void;
};

class ArticleRow extends PureComponent<Props> {
  handlePress = () => {
    const { onPress, article } = this.props;
    onPress(article.id);
  };

  render() {
    const { article } = this.props;

    return (
      <TouchableHighlight
        underlayColor={pressedColor}
        onPress={this.handlePress}
      >
        <View style={styles.contentContainer}>
          <FontAwesome5 name="file" size={24} style={styles.icon} />
          <Text style={styles.title}>{article.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

// theme.colors.surface with pressed state opacity
const pressedColor = 'rgba(9, 5, 46, .12)';

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
