import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
};

function B({ children, style = {} }: Props) {
  return <Text style={[styles.bold, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});

export { B };
