import React from 'react';
import type { AppNavigationProps } from '@/view/Router';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { theme } from '@/theme';

type Props = AppNavigationProps<'ArticleScreen'>;

function factory() {
  return function ArticleScreen({ route }: Props) {
    const { id } = route.params;

    return (
      <View style={styles.container}>
        <WebView source={{ html: `${id}` }} />
      </View>
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
