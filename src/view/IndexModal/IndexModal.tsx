import { ARTICLE_TYPES } from '@/domain/models/Article';
import { theme } from '@/theme';
import type { RootNavigationProps } from '@/view/Router';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type IndexButtonProps = {
  letter: string;
  onPress: (l: string) => void;
};

function IndexButton({ letter, onPress }: IndexButtonProps) {
  return (
    <TouchableHighlight
      underlayColor="red"
      style={styles.button}
      onPress={() => onPress(letter)}
    >
      <Text style={styles.buttonLabel}>{letter}</Text>
    </TouchableHighlight>
  );
}

type Props = RootNavigationProps<'IndexModal'>;

function IndexModal({ navigation }: Props) {
  const goBack = useCallback(() => navigation.goBack(), [navigation]);
  const handlePressLetter = useCallback(
    (l: string) =>
      navigation.navigate('ArticleScreen', {
        type: ARTICLE_TYPES.INDEX,
        idOrSectionId: l,
      }),
    [navigation]
  );

  const buttons = useMemo(
    () =>
      ALPHABET.split('').map((l) => (
        <IndexButton key={l} letter={l} onPress={handlePressLetter} />
      )),
    [handlePressLetter]
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack}>
        <View style={styles.underlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modal}>
        <Text style={styles.title}>Index</Text>
        <View style={styles.buttonGroup}>{buttons}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    position: 'relative',
  },
  underlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modal: {
    ...theme.modal,
    backgroundColor: theme.colors.surface,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  title: {
    ...theme.fonts.headlineSmall,
    marginBottom: theme.spaces.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    width: 40,
    marginRight: theme.spaces.md,
    marginBottom: theme.spaces.md,
    padding: theme.spaces.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: theme.colors.onPrimary,
  },
});

export { IndexModal };
