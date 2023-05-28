import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function EmptyResultList() {
  return (
    <View style={styles.container}>
      <Text>No results</Text>
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

export { EmptyResultList };
