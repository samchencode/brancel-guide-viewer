import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as ArticleScreen } from '@/view/ArticleScreen';
import { theme } from '@/theme';
import type { ArticleId } from '@/domain/models/Article';

type AppNavigationParams = {
  HomeScreen: undefined;
  ArticleScreen: { id: ArticleId };
};

type RootNavigationParams = {
  AppNavigation: undefined;
};

function factory(HomeScreen: HomeScreen, ArticleScreen: ArticleScreen) {
  const AppStack = createStackNavigator<AppNavigationParams>();
  const RootStack = createStackNavigator<RootNavigationParams>();

  function AppNavigator() {
    return (
      <AppStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerTitleStyle: theme.fonts.titleLarge,
        }}
      >
        <AppStack.Screen name="HomeScreen" component={HomeScreen} />
        <AppStack.Screen name="ArticleScreen" component={ArticleScreen} />
      </AppStack.Navigator>
    );
  }

  function RootNavigator() {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AppNavigation" component={AppNavigator} />
      </RootStack.Navigator>
    );
  }

  return function Router() {
    return <RootNavigator />;
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
export type AppNavigationProps<T extends keyof AppNavigationParams> =
  CompositeScreenProps<
    StackScreenProps<AppNavigationParams, T>,
    StackScreenProps<RootNavigationParams>
  >;
export type RootNavigationProps<T extends keyof RootNavigationParams> =
  CompositeScreenProps<
    StackScreenProps<RootNavigationParams, T>,
    StackScreenProps<AppNavigationParams>
  >;
