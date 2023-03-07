import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { theme } from '@/theme';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
};

function Title({ children, style = {} }: Props) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...theme.fonts.titleLarge,
    marginTop: theme.spaces.md,
    marginBottom: theme.spaces.sm,
    marginRight: theme.spaces.md,
    marginLeft: theme.spaces.md,
  },
});

export { Title };
