import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as cheerio from 'cheerio';
import ejs from 'ejs';

function factory(foo: string) {
  return function App() {
    const template = ejs.compile('<h1><%- greeting %></h1>');
    const html = template({ greeting: 'hello world' });
    const $ = cheerio.load(html);

    return (
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <Text>{foo}</Text>
        <Text>{$.html()}</Text>
        {/* eslint-disable-next-line react/style-prop-object */}
        <StatusBar style="auto" />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Type = ReturnType<typeof factory>;

export { factory };
export type { Type };
