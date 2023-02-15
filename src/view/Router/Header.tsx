import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import Constants from 'expo-constants';
import type { StackHeaderProps } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';

type IconButtonProps = {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function IconButton({ iconName, onPress, style = {} }: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, style]}>
      <FontAwesome5 name={iconName} size={24} style={styles.icon} />
    </TouchableOpacity>
  );
}

type Props = StackHeaderProps;

function Header({ navigation, route, options, back }: Props) {
  const title = getHeaderTitle(options, route.name);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <View style={styles.header}>
        {back && (
          <IconButton
            iconName="arrow-left"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  statusBar: {
    backgroundColor: theme.colors.surfaceTint.elevationTwo,
    height: Constants.statusBarHeight,
  },
  header: {
    backgroundColor: theme.colors.surfaceTint.elevationTwo,
    height: 64,
    paddingRight: theme.spaces.md,
  },
  title: {
    ...theme.fonts.titleLarge,
    color: theme.colors.onSurface,
    position: 'absolute',
    left: 56,
    top: '50%',
    transform: [{ translateY: -14 }],
  },
  icon: {
    color: theme.colors.onSurface,
  },
  iconButton: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 4,
  },
});

export { Header };
