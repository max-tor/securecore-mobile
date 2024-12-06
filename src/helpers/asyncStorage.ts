import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadFromStorage = async (key: string) => {
  try {
    const item = await AsyncStorage.getItem(key);

    if (!item) {
      return null;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(error);
  }
};
export const saveToStorage = (toSave: unknown, key: string) => {
  if (!toSave) {
    return AsyncStorage.removeItem(key);
  }

  return AsyncStorage.setItem(key, JSON.stringify(toSave));
};

export const removeFromStorage = (key: string) => AsyncStorage.removeItem(key);
