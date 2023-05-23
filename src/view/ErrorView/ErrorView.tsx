import { theme } from '@/theme';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

type Props = {
  error: unknown;
};

const errorToString = (error: Error) => `${error.message} - (${error.name})`;
const unknownToString = (error: unknown) => String(error);

function ErrorView({ error }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dialog}>
        <Text style={styles.heading}>Uh oh!</Text>
        <Text style={styles.subheading}>Something went wrong...</Text>
        <Text style={[styles.message, styles.errorText]}>
          {error instanceof Error
            ? errorToString(error)
            : unknownToString(error)}
        </Text>
        <Text style={styles.message}>
          Please restart the app and try again. Let us know if the problem
          persists.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spaces.md,
  },
  dialog: {
    backgroundColor: theme.colors.errorContainer,
    padding: theme.spaces.lg,
    borderRadius: 28,
    minWidth: 280,
    maxWidth: 560,
  },
  heading: {
    ...theme.fonts.headlineLarge,
    marginBottom: theme.spaces.md,
    color: theme.colors.onErrorContainer,
  },
  subheading: {
    ...theme.fonts.titleLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
  },
  message: {
    ...theme.fonts.bodyLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
  },
  errorText: {
    marginHorizontal: theme.spaces.lg,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
});

export { ErrorView };
