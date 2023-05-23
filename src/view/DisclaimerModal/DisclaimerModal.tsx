import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as Linking from 'expo-linking';
import { theme } from '@/theme';
import type { RootNavigationProps } from '@/view/Router';
import { AcceptButton } from '@/view/DisclaimerModal/AcceptButton';

type AProps = {
  children: string | JSX.Element;
  linkTo: string;
};

function A({ children, linkTo }: AProps) {
  return (
    <Text
      style={{ color: theme.colors.primary }}
      onPress={async () => {
        if (await Linking.canOpenURL(linkTo)) {
          Linking.openURL(linkTo);
        }
      }}
    >
      {children}
    </Text>
  );
}

type Props = RootNavigationProps<'DisclaimerModal'>;

function DisclaimerModal({ navigation }: Props) {
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={goBack}>
        <View style={styles.underlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modal}>
        <Text style={styles.title}>Disclaimer</Text>
        <Text style={styles.supportingText}>
          These guidelines are a collection of information from medical journals
          and personal experience, put together over the course of years by a
          physician with 40 years of clinical practice. Readers wishing to
          confirm practice recommendations are encouraged to seek out validity
          through the medical literature and through three organizations in
          particular, the American Academy of Family Physicians at{' '}
          <A linkTo="https://www.aafp.org/home.html">
            https://www.aafp.org/home.html
          </A>
          , the American Academy of Orthopedic Surgeons at{' '}
          <A linkTo="https://www.aaos.org/">https://www.aaos.org/</A>, and the
          American College of Sports Medicine at{' '}
          <A linkTo="https://www.acsm.org/">https://www.acsm.org/</A>.
        </Text>
        <View style={styles.buttonGroup}>
          <AcceptButton onPress={goBack} />
        </View>
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
    justifyContent: 'flex-end',
    marginTop: theme.spaces.lg,
  },
  title: {
    ...theme.fonts.headlineSmall,
    marginBottom: theme.spaces.md,
  },
  supportingText: theme.fonts.bodyMedium,
});

export { DisclaimerModal };
