import React, { PureComponent } from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import type { ArticleSearchResult } from '@/domain/models/Article';
import { theme } from '@/theme';
import { SegmentedResultText } from '@/view/SearchScreen/SegmentedResultText';

type Props = {
  result: ArticleSearchResult;
  onPress: (result: ArticleSearchResult) => void;
};

class ResultListItem extends PureComponent<Props> {
  handlePress = () => {
    const { onPress, result } = this.props;
    onPress(result);
  };

  render() {
    const { result } = this.props;

    return (
      <TouchableHighlight
        underlayColor={theme.colors.opacity(0.12).onSurface}
        onPress={this.handlePress}
      >
        <View style={styles.contentContainer}>
          <FontAwesome5 name="file" size={24} style={styles.icon} />
          <View style={styles.content}>
            <Text style={styles.headline} numberOfLines={1}>
              <SegmentedResultText segments={result.getTitleSegments()} />
            </Text>
            <Text style={styles.supportingText} numberOfLines={1}>
              <SegmentedResultText
                segments={result.getTruncatedBodySegments(10)}
              />
            </Text>
          </View>
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
  content: {
    justifyContent: 'center',
    flex: 1,
    overflow: 'hidden',
    paddingRight: theme.spaces.lg,
  },
  icon: {
    marginRight: theme.spaces.md,
  },
  headline: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onSurface,
  },
  supportingText: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurfaceVariant,
  },
});

export { ResultListItem };
