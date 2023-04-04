import { theme } from '@/theme';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function AcceptButton({ onPress, style = {} }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.text}>Got it!</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  text: {
    ...theme.fonts.labelLarge,
    color: theme.colors.primary,
  },
});

export { AcceptButton };
