import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@v1-seen-disclaimer-before';

export async function seenDisclaimerBefore() {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored !== null;
}

export async function setSeenDisclaimerBefore() {
  await AsyncStorage.setItem(STORAGE_KEY, 'true');
}
