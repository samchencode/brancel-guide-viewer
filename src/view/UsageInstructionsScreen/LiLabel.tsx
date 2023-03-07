import { theme } from '@/theme';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

type Props = {
  children: string;
};

function LiLabel({ children }: Props) {
  return (
    <View style={styles.listItemLabel}>
      <Text style={styles.listItemLabelText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spaces.md,
    marginLeft: theme.spaces.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.onSurface,
  },
  listItemLabelText: {
    color: 'white',
    fontSize: 16,
  },
});

export { LiLabel };
