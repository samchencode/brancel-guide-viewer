import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp, TextStyle } from 'react-native';
import Constants from 'expo-constants';
import type { StackHeaderProps } from '@react-navigation/stack';
import { getHeaderTitle } from '@react-navigation/elements';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';
import { Menu } from '@/view/Router/Menu';
import { ARTICLE_TYPES } from '@/domain/models/Article';

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

function Header({ navigation, route, options, back }: Props) {
  const title = getHeaderTitle(options, route.name);

  const isHomeScreen = route.name === 'HomeScreen';

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleTocPress = useCallback(
    () => navigation.navigate('HomeScreen'),
    [navigation]
  );
  const handleIndexPress = useCallback(
    () => navigation.navigate('IndexModal'),
    [navigation]
  );
  const handleUsageInstructionsPress = useCallback(
    () => navigation.navigate('UsageInstructionsScreen'),
    [navigation]
  );
  const handleDisclaimerPress = useCallback(
    () => navigation.navigate('DisclaimerModal'),
    [navigation]
  );
  const handleLicensePress = useCallback(
    () => navigation.navigate('LicenseScreen'),
    [navigation]
  );
  const handleAboutPress = useCallback(
    () => navigation.navigate('ArticleScreen', { type: ARTICLE_TYPES.ABOUT }),
    [navigation]
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuPress = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [menuOpen]);

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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 2,
    shadowRadius: 0.15,
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
    elevation: 2,
    shadowRadius: 0.15,
  },
});

export { Header };
