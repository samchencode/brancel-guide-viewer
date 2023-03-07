import React from 'react';
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { theme } from '@/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

function LiText({ children, style = {} }: Props) {
  return <Text style={[styles.listItemText, style]}>{children}</Text>;
}

const styles = {
  listItemText: {
    flexShrink: 1,
    marginRight: theme.spaces.md,
  },
};

export { LiText };
