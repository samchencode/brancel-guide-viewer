import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function SearchBar({ style = {}, onPress }: Props) {
  return (
    <TouchableHighlight
      underlayColor={theme.colors.opacity(0.14).primary}
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        <FontAwesome5 name="search" size={24} style={styles.icon} />
        <Text style={styles.label}>Search all articles</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.elevations[2],
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
  },
  contentContainer: {
    borderRadius: 999,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.opacity(0.11).primary,
  },
  icon: {
    paddingHorizontal: theme.spaces.md,
    color: theme.colors.onSurface,
  },
  label: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onSurfaceVariant,
  },
});

export { SearchBar };
