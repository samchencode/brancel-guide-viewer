import { theme } from '@/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function ProgressIndicatorView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>
        This may take up to a minute if there is a new update to be downloaded.
        Please keep the screen on until loading is finished.
      </Text>
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
  loadingText: {
    marginTop: theme.spaces.lg,
    marginLeft: theme.spaces.md,
    marginRight: theme.spaces.md,
  },
});

export { ProgressIndicatorView };
