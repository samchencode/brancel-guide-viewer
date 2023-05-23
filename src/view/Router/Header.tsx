import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp, TextStyle } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import type { StackHeaderProps } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';
import { Menu } from '@/view/Router/Menu';
import { ARTICLE_TYPES } from '@/domain/models/Article';
import type { ClearCacheAction } from '@/application/ClearCacheAction';
import { NoInternetBanner, useNoInternetBanner } from '@/view/NoInternetBanner';

type IconButtonProps = {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle | TextStyle>;
};

function IconButton({
  iconName,
  onPress,
  style = {},
  iconStyle = {},
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.iconButton, style]}>
      <FontAwesome5
        name={iconName}
        size={24}
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
}

type Props = StackHeaderProps;

function factory(clearCacheAction: ClearCacheAction) {
  return function Header({ navigation, route, options, back }: Props) {
    const title = getHeaderTitle(options, route.name);

    const isHomeScreen = route.name === 'HomeScreen';

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuPress = useCallback(() => {
      setMenuOpen(!menuOpen);
    }, [menuOpen]);

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);
    const handleTocPress = useCallback(
      () => navigation.navigate('HomeScreen'),
      [navigation]
    );
    const handleIndexPress = useCallback(
      () => navigation.navigate('IndexModal'),
      [navigation]
    );
    const handleUsageInstructionsPress = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('UsageInstructionsScreen');
    }, [navigation]);
    const handleDisclaimerPress = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('DisclaimerModal');
    }, [navigation]);
    const handleLicensePress = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('LicenseScreen');
    }, [navigation]);
    const handleAboutPress = useCallback(() => {
      setMenuOpen(false);
      navigation.navigate('ArticleScreen', { type: ARTICLE_TYPES.ABOUT });
    }, [navigation]);
    const handleClearCachePress = useCallback(() => {
      setMenuOpen(false);
      clearCacheAction.execute();
    }, []);

    const { shouldShowNoInternetBanner, handleDismissNoInternetBanner } =
      useNoInternetBanner();

    return (
      <View style={styles.container}>
        <StatusBar translucent />
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
          <View style={styles.trailingIconGroup}>
            {!isHomeScreen && (
              <IconButton
                iconName="clipboard-list"
                onPress={handleTocPress}
                iconStyle={styles.trailingIcon}
              />
            )}
            <IconButton
              iconName="list"
              onPress={handleIndexPress}
              iconStyle={styles.trailingIcon}
            />
            <IconButton
              iconName="ellipsis-v"
              onPress={handleMenuPress}
              iconStyle={styles.trailingIcon}
            />
          </View>
          <Menu
            visible={menuOpen}
            style={styles.menu}
            onPressAbout={handleAboutPress}
            onPressDisclaimer={handleDisclaimerPress}
            onPressLicense={handleLicensePress}
            onPressUsageInstructions={handleUsageInstructionsPress}
            onPressClearCache={handleClearCachePress}
          />
        </View>
        <NoInternetBanner
          visible={shouldShowNoInternetBanner}
          onPressDismiss={handleDismissNoInternetBanner}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    ...theme.elevations[2],
  },
  statusBar: {
    backgroundColor: theme.colors.opacity(0.08).primary,
    height: Constants.statusBarHeight,
  },
  header: {
    backgroundColor: theme.colors.opacity(0.08).primary,
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
  trailingIconGroup: {
    position: 'absolute',
    top: 8,
    right: 4,
    display: 'flex',
    flexDirection: 'row',
  },
  trailingIcon: {
    color: theme.colors.onSurfaceVariant,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    ...theme.elevations[2],
  },
});

export { factory };
export type Type = ReturnType<typeof factory>;
