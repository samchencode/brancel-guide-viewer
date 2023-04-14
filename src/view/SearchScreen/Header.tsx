import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '@/theme';

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
      <FontAwesome5 name={iconName} size={24} style={iconStyle} />
    </TouchableOpacity>
  );
}

type Props = {
  onPressBack: () => void;
  onPressClear: () => void;
  onChangeValue: (t: string) => void;
  value: string;
};

function Header({ value, onPressBack, onPressClear, onChangeValue }: Props) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

  return (
    <View style={styles.container}>
      <IconButton iconName="arrow-left" onPress={onPressBack} />
      <TextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder="Search All Articles"
        style={styles.input}
        ref={inputRef}
      />
      <IconButton iconName="times" onPress={onPressClear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spaces.xs,
  },
  input: {
    flex: 1,
    ...theme.fonts.bodyLarge,
    color: theme.colors.onBackground,
    lineHeight: 0,
  },
});

export { Header };
