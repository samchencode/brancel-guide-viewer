import { theme } from '@/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

function ProgressIndicatorView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { ProgressIndicatorView };
