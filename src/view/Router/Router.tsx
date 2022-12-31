import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { Type as HomeScreen } from '@/view/HomeScreen';

type AppNavigationParams = {
  HomeScreen: undefined;
};

type RootNavigationParams = {
  AppNavigation: undefined;
};

function factory(HomeScreen: HomeScreen) {
  const AppStack = createStackNavigator<AppNavigationParams>();
  const RootStack = createStackNavigator<RootNavigationParams>();

  function AppNavigator() {
    return (
      <AppStack.Navigator>
        <AppStack.Screen name="HomeScreen" component={HomeScreen} />
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
