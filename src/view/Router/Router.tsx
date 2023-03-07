import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as ArticleScreen } from '@/view/ArticleScreen';
import { IndexModal } from '@/view/IndexModal';
import { DisclaimerModal } from '@/view/DisclaimerModal';
import { Header } from '@/view/Router/Header';
import type { ARTICLE_TYPES } from '@/domain/models/Article';

type ValueOf<T> = T[keyof T];

type AppNavigationParams = {
  HomeScreen: undefined;
  ArticleScreen: {
    type: ValueOf<typeof ARTICLE_TYPES>;
    idOrSectionId: string;
  };
};

type RootNavigationParams = {
  AppNavigation: undefined;
  IndexModal: undefined;
  DisclaimerModal: undefined;
};

function factory(HomeScreen: HomeScreen, ArticleScreen: ArticleScreen) {
  const AppStack = createStackNavigator<AppNavigationParams>();
  const RootStack = createStackNavigator<RootNavigationParams>();

  function AppNavigator() {
    return (
      <AppStack.Navigator screenOptions={{ header: Header }}>
        <AppStack.Screen name="HomeScreen" component={HomeScreen} />
        <AppStack.Screen name="ArticleScreen" component={ArticleScreen} />
      </AppStack.Navigator>
    );
  }

  function RootNavigator() {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AppNavigation" component={AppNavigator} />
        <RootStack.Group screenOptions={{ presentation: 'transparentModal' }}>
          <RootStack.Screen name="IndexModal" component={IndexModal} />
          <RootStack.Screen
            name="DisclaimerModal"
            component={DisclaimerModal}
          />
        </RootStack.Group>
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
