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
      <View style={styles.content}>
        <MenuItem onPress={onPressUsageInstructions}>
          Usage Instructions
        </MenuItem>
        <MenuItem onPress={onPressDisclaimer}>Disclaimer</MenuItem>
        <MenuItem onPress={onPressLicense}>License</MenuItem>
        <MenuItem onPress={onPressClearCache}>Clear Cache</MenuItem>
        <MenuItem onPress={onPressAbout}>About</MenuItem>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    display: 'none',
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  menuVisible: { display: 'flex' },
  content: {
    paddingTop: theme.spaces.sm,
    paddingBottom: theme.spaces.sm,
    backgroundColor: theme.colors.opacity(0.08).primary,
  },
});

export { Menu };
