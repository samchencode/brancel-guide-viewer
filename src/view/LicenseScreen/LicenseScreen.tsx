import { theme } from '@/theme';
import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

function factory() {
  return function LicenseScreen() {
    return (
      <ScrollView style={styles.container}>
        <Text>Licenses go here...</Text>
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
