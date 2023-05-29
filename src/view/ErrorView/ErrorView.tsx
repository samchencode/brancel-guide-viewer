import { theme } from '@/theme';
import { DangerButton } from '@/view/ErrorView/DangerButton';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import * as Updates from 'expo-updates';
import { Email } from '@/view/ErrorView/Email';

type Props = {
  error: unknown;
};

const errorToString = (error: Error) => `${error.message} - (${error.name})`;
const unknownToString = (error: unknown) => String(error);

function ErrorView({ error }: Props) {
  const handleRestart = useCallback(() => {
    Updates.reloadAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dialog}>
        <Text style={styles.subheading}>Something went wrong...</Text>
        <ScrollView style={styles.errorTextContainer}>
          <Text style={styles.errorText}>
            {error instanceof Error
              ? errorToString(error)
              : unknownToString(error)}
          </Text>
        </ScrollView>
        <Text style={styles.message}>
          Please restart the app and try again. Clearing the cache may help.
          Contact us at <Email>markbrancelmd@gmail.com</Email>
        </Text>
        <DangerButton onPress={handleRestart} style={styles.button} />
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
    marginVertical: theme.spaces.md,
  },
  dialog: {
    backgroundColor: theme.colors.errorContainer,
    padding: theme.spaces.lg,
    borderRadius: 28,
    minWidth: 280,
    maxWidth: 560,
  },
  subheading: {
    ...theme.fonts.titleLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
  },
  message: {
    ...theme.fonts.bodyLarge,
    marginBottom: theme.spaces.md,
    color: theme.colors.onErrorContainer,
  },
  errorText: {
    ...theme.fonts.bodyLarge,
    marginBottom: theme.spaces.sm,
    color: theme.colors.onErrorContainer,
    marginHorizontal: theme.spaces.lg,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  errorTextContainer: {
    maxHeight: 200,
  },
  button: {
    alignSelf: 'flex-end',
  },
});

export { ErrorView };
