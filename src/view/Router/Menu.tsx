import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@/theme';
import { MenuItem } from '@/view/Router/MenuItem';

type Props = {
  visible: boolean;
  style?: StyleProp<ViewStyle>;
  onPressUsageInstructions: () => void;
  onPressDisclaimer: () => void;
  onPressLicense: () => void;
  onPressAbout: () => void;
  onPressClearCache: () => void;
};

function Menu({
  visible,
  onPressAbout,
  onPressDisclaimer,
  onPressLicense,
  onPressUsageInstructions,
  onPressClearCache,
  style = {},
}: Props) {
  return (
    <View style={[styles.menu, visible && styles.menuVisible, style]}>
      <MenuItem onPress={onPressUsageInstructions}>Usage Instructions</MenuItem>
      <MenuItem onPress={onPressDisclaimer}>Disclaimer</MenuItem>
      <MenuItem onPress={onPressLicense}>License</MenuItem>
      <MenuItem onPress={onPressClearCache}>Clear Cache</MenuItem>
      <MenuItem onPress={onPressAbout}>About</MenuItem>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    display: 'none',
    paddingTop: theme.spaces.sm,
    paddingBottom: theme.spaces.sm,
    backgroundColor: theme.colors.surfaceTint.elevationTwo,
    borderRadius: 4,
  },
  menuVisible: { display: 'flex' },
});

export { Menu };
