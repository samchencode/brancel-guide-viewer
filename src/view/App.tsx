import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/view/ErrorBoundary/ErrorBoundary';

function factory(Router: Router) {
  return function App() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </ErrorBoundary>
      </GestureHandlerRootView>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
