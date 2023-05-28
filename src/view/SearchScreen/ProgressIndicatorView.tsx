import { theme } from '@/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

type Props = {
  hasQuery: boolean;
};

function SearchLoading({ hasQuery }: Props) {
  return (
    <View style={styles.container}>
      {hasQuery ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <Text>
          After a search term is entered, the results will be displayed here!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spaces.md,
  },
});

export { SearchLoading };
