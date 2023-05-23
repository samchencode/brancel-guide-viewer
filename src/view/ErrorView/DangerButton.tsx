import { theme } from '@/theme';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function DangerButton({ onPress, style = {} }: Props) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.container, style]}
      underlayColor="#C82E32"
    >
      <Text style={styles.text}>Restart</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: theme.colors.error,
    borderRadius: 20,
  },
  text: {
    ...theme.fonts.labelLarge,
    color: theme.colors.onError,
  },
});

export { DangerButton };
