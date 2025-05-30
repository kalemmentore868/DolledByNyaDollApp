import * as SecureStore from "expo-secure-store";

export const STORAGE_NAMES = {
  userProfile: "userProfile",
  settings: "settings",
  preferences: "preferences",
  appData: "appData",
  cartData: "cartData",
};

type Feedback = {
  error: boolean;
  success: boolean;
  data?: any;
};

const performSecureStoreOperation = async (
  operation: "setItem" | "getItem" | "removeItem" | "clear",
  key?: keyof typeof STORAGE_NAMES,
  value?: any
): Promise<Feedback> => {
  try {
    let data;
    switch (operation) {
      case "setItem":
        await SecureStore.setItemAsync(
          STORAGE_NAMES[key!],
          JSON.stringify(value)
        );
        break;
      case "getItem":
        const _data = await SecureStore.getItemAsync(STORAGE_NAMES[key!]);
        data = _data ? JSON.parse(_data) : null;
        break;
      case "removeItem":
        await SecureStore.deleteItemAsync(STORAGE_NAMES[key!]);
        break;
      case "clear":
        // SecureStore does not have a clear method, you need to manually remove each item
        const keys = Object.values(STORAGE_NAMES);
        for (const key of keys) {
          await SecureStore.deleteItemAsync(key);
        }
        break;
      default:
        throw new Error("Invalid operation");
    }
    return { success: true, error: false, data: data };
  } catch (error) {
    return { success: false, error: true, data: null };
  }
};

export const setDataInStorage = async (
  key: keyof typeof STORAGE_NAMES,
  value: any
): Promise<Feedback> => {
  return performSecureStoreOperation("setItem", key, value);
};

export const getDataInStorage = async (
  key: keyof typeof STORAGE_NAMES
): Promise<Feedback> => {
  return performSecureStoreOperation("getItem", key);
};

export const removeDataInStorage = async (
  key: keyof typeof STORAGE_NAMES
): Promise<Feedback> => {
  return performSecureStoreOperation("removeItem", key);
};

export const clearDataInStorage = async (): Promise<Feedback> => {
  return performSecureStoreOperation("clear");
};
