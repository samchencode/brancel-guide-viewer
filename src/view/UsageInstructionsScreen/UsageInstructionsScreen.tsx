import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import type { AppNavigationProps } from '@/view/Router';
import { theme } from '@/theme';
import { B } from '@/view/UsageInstructionsScreen/B';
import { Title } from '@/view/UsageInstructionsScreen/Title';
import { LiLabel } from '@/view/UsageInstructionsScreen/LiLabel';
import { LiText } from '@/view/UsageInstructionsScreen/LiText';
import { Subtitle } from '@/view/UsageInstructionsScreen/Subtitle';
import { Email } from '@/view/UsageInstructionsScreen/Email';

type Props = AppNavigationProps<'UsageInstructionsScreen'>;

function factory() {
  return function UsageInstructionsScreen({ navigation }: Props) {
    const handleTocPress = useCallback(() => {
      navigation.popToTop();
    }, [navigation]);

    const handleIndexPress = useCallback(() => {
      navigation.navigate('IndexModal');
    }, [navigation]);

    return (
      <ScrollView style={styles.container}>
        <Title>Guideline Navigation Instructions</Title>
        <Subtitle>
          These are basic instructions on how to get around in any of the
          Brancel medical guides.
        </Subtitle>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <LiLabel>1</LiLabel>
            <LiText>
              Each guideline has a <B>Table of Contents</B> present when you
              first open the app. Each item within the Table of Contents is
              linked to its subject matter so that you need only touch or mouse
              click the item and you will be taken to that subject matter.
            </LiText>
          </View>
          <View style={styles.listItem}>
            <LiLabel>2</LiLabel>
            <LiText>
              Each guideline also has an <B>Index</B>. The Index begins with a
              letter index table so that you need only touch or mouse click on
              the letter, and you will be taken to that letter within the Index.
              Once within a given letter in the Index, you can scroll up or down
              to find your subject matter.
            </LiText>
          </View>
          <View style={styles.listItem}>
            <LiLabel>3</LiLabel>
            <LiText>
              Access to the Table of Contents and Index can be done at any time
              by tapping either of the two respective buttons at the top of
              every page with the following appearance to those buttons:{' '}
              <B>Table of Contents</B> (
              <Icon name="clipboard-list" size={18} onPress={handleTocPress} />)
              and <B>Index</B> (
              <Icon name="list" size={18} onPress={handleIndexPress} />
              ). Additionally, set throughout the guideline are the following
              statements and links, which allow you to go to the Table of
              Contents or Index: &quot;Go to the{' '}
              <Text onPress={handleTocPress}>Table of Contents</Text> or the{' '}
              <Text onPress={handleIndexPress}>Index</Text>.&quot;
            </LiText>
          </View>
          <View style={styles.listItem}>
            <LiLabel>4</LiLabel>
            <LiText>
              After reading these instructions, should you have difficulty
              navigating through these guidelines, please contact Dr. Brancel at{' '}
              <Email>markbrancelmd@gmail.com</Email>.
            </LiText>
          </View>
        </View>
      </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  list: {
    display: 'flex',
    flexGrow: 1,
    marginTop: theme.spaces.md,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spaces.sm,
    paddingTop: theme.spaces.sm,
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
