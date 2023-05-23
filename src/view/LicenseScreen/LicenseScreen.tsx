import React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { theme } from '@/theme';
import { licenseText } from '@/view/LicenseScreen/licenseText';
import { FlatList } from 'react-native-gesture-handler';

type LicenseSection = {
  key: string;
  text: string;
};

const sections = licenseText
  .split('-----')
  .map<LicenseSection>((t, i) => ({ key: i.toString(), text: `${t}-----` }));

function renderItem({ item }: ListRenderItemInfo<LicenseSection>) {
  return <Text style={styles.text}>{item.text}</Text>;
}

function factory() {
  return function LicenseScreen() {
    return (
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.container}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: 'black',
    fontSize: 12,
    marginHorizontal: theme.spaces.md,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
