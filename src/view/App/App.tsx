import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { Type as Router } from '@/view/Router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/view/ErrorView';
import {
  queryClient,
  useReactQueryAppStateListener,
} from '@/view/App/prepareReactQuery';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { CheckCacheEmptyAction } from '@/application/CheckCacheEmptyAction';
import { useReloadIfEmptyAndGainInternet } from '@/view/App/useReloadIfEmptyAndGainInternet';

function factory(Router: Router, checkCacheEmptyAction: CheckCacheEmptyAction) {
  const checkCacheEmpty = () => checkCacheEmptyAction.execute();

  return function App() {
    useReactQueryAppStateListener();
    useReloadIfEmptyAndGainInternet(checkCacheEmpty);

    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ErrorBoundary>
            <NavigationContainer>
              <QueryClientProvider client={queryClient}>
                <Router />
              </QueryClientProvider>
            </NavigationContainer>
          </ErrorBoundary>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
