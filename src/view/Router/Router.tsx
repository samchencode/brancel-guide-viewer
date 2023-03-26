import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { Type as HomeScreen } from '@/view/HomeScreen';
import type { Type as ArticleScreen } from '@/view/ArticleScreen';
import type { Type as LicenseScreen } from '@/view/LicenseScreen';
import { IndexModal } from '@/view/IndexModal';
import { DisclaimerModal } from '@/view/DisclaimerModal';
import type { Type as Header } from '@/view/Router/Header';
import type { ARTICLE_TYPES } from '@/domain/models/Article';
import type { Type as UsageInstructionsScreen } from '@/view/UsageInstructionsScreen';

type ValueOf<T> = T[keyof T];

type AppNavigationParams = {
  HomeScreen: undefined;
  ArticleScreen: {
    type: ValueOf<typeof ARTICLE_TYPES>;
    idOrSectionId: string;
  };
  UsageInstructionsScreen: undefined;
  LicenseScreen: undefined;
};

type RootNavigationParams = {
  AppNavigation: undefined;
  IndexModal: undefined;
  DisclaimerModal: undefined;
};

function factory(
  HomeScreen: HomeScreen,
  ArticleScreen: ArticleScreen,
  UsageInstructionsScreen: UsageInstructionsScreen,
  LicenseScreen: LicenseScreen,
  Header: Header
) {
  const AppStack = createStackNavigator<AppNavigationParams>();
  const RootStack = createStackNavigator<RootNavigationParams>();

  function AppNavigator() {
    return (
      <AppStack.Navigator screenOptions={{ header: Header, title: '' }}>
        <AppStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: 'Articles' }}
        />
        <AppStack.Screen
          name="ArticleScreen"
          component={ArticleScreen}
          getId={({ params }) => params.idOrSectionId ?? params.type}
        />
        <AppStack.Screen
          name="UsageInstructionsScreen"
          component={UsageInstructionsScreen}
        />
        <AppStack.Screen name="LicenseScreen" component={LicenseScreen} />
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
