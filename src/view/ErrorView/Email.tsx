import React, { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import * as Linking from 'expo-linking';
import { theme } from '@/theme';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
};

function Email({ children, style = {} }: Props) {
  const handlePress = useCallback(async () => {
    const email = 'mailto:markbrancelmd@gmail.com';
    if (await Linking.canOpenURL(email)) {
      Linking.openURL(email);
    }
  }, []);

  return (
    <Text style={[styles.email, style]} onPress={handlePress}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  email: {
    color: theme.colors.primary,
  },
});

export { Email };
