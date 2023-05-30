import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as Updates from 'expo-updates';

const wait = (ms: number) =>
  new Promise((s) => {
    setTimeout(s, ms);
  });

let tries = 0;

async function fetchIsConnectedOrRetry(): Promise<boolean> {
  const state = await NetInfo.fetch();
  if (state.isConnected !== null) return !!state.isConnected;
  if (tries > 10) return false;
  tries += 1;
  await wait(300);
  return fetchIsConnectedOrRetry();
}

function useReloadIfEmptyAndGainInternet(isCacheEmpty: () => Promise<boolean>) {
  useEffect(() => {
    isCacheEmpty().then((isEmpty) => {
      if (!isEmpty) return;
      fetchIsConnectedOrRetry().then((isConnected) => {
        if (isConnected) return;
        const unsubscribe = NetInfo.addEventListener((state) => {
          if (!state.isInternetReachable) return;
          unsubscribe();
          Updates.reloadAsync();
        });
      });
    });
  }, [isCacheEmpty]);
}

export { useReloadIfEmptyAndGainInternet };
