import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { theme } from '@/theme';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
};

function Subtitle({ children, style = {} }: Props) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  subtitle: {
    ...theme.fonts.bodyLarge,
    marginLeft: theme.spaces.md,
    marginRight: theme.spaces.md,
  },
});

export { Subtitle };
