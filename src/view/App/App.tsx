import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/view/ErrorBoundary/ErrorBoundary';
import {
  queryClient,
  useReactQueryAppStateListener,
} from '@/view/App/prepareReactQuery';
import { QueryClientProvider } from '@tanstack/react-query';

function factory(Router: Router) {
  return function App() {
    useReactQueryAppStateListener();

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <Router />
            </QueryClientProvider>
          </NavigationContainer>
        </ErrorBoundary>
      </GestureHandlerRootView>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
