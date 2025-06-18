/* src/storage/secureStore.ts ---------------------------------------------- */

import * as SecureStore from "expo-secure-store";

/* ------------------------------------------------------------------ */
/*  Keys kept in SecureStore                                          */
/* ------------------------------------------------------------------ */

export const STORAGE_NAMES = {
  userProfile: "userProfile",
  settings: "settings",
  preferences: "preferences",
  appData: "appData",
  cartData: "cartData",
} as const;

type StoreKey = keyof typeof STORAGE_NAMES;

/* ------------------------------------------------------------------ */
/*  Common response envelope                                          */
/* ------------------------------------------------------------------ */

export type Feedback<T = unknown> = {
  success: boolean;
  error: boolean;
  data?: T | null;
};

/* ------------------------------------------------------------------ */
/*  Low-level helper – overloads so TS knows when key/value required  */
/* ------------------------------------------------------------------ */

// ─ clear ──────────────────────────────────────────────────────────────
async function performSecureStoreOperation(op: "clear"): Promise<Feedback>;

// ─ getItem / removeItem ───────────────────────────────────────────────
async function performSecureStoreOperation(
  op: "getItem" | "removeItem",
  key: StoreKey
): Promise<Feedback>;

// ─ setItem ────────────────────────────────────────────────────────────
async function performSecureStoreOperation(
  op: "setItem",
  key: StoreKey,
  value: any
): Promise<Feedback>;

// ─ implementation ────────────────────────────────────────────────────
async function performSecureStoreOperation(
  operation: "setItem" | "getItem" | "removeItem" | "clear",
  key?: StoreKey,
  value?: any
): Promise<Feedback> {
  try {
    let data: any;

    switch (operation) {
      case "setItem":
        await SecureStore.setItemAsync(
          STORAGE_NAMES[key!],
          JSON.stringify(value)
        );
        break;

      case "getItem": {
        const raw = await SecureStore.getItemAsync(STORAGE_NAMES[key!]);
        data = raw ? JSON.parse(raw) : null;
        break;
      }

      case "removeItem":
        await SecureStore.deleteItemAsync(STORAGE_NAMES[key!]);
        break;

      case "clear":
        await Promise.all(
          Object.values(STORAGE_NAMES).map((k) =>
            SecureStore.deleteItemAsync(k)
          )
        );
        break;
    }

    return { success: true, error: false, data };
  } catch {
    return { success: false, error: true, data: null };
  }
}

/* ------------------------------------------------------------------ */
/*  Public helpers – nicely typed                                     */
/* ------------------------------------------------------------------ */

export const setDataInStorage = async (key: StoreKey, value: unknown) =>
  await performSecureStoreOperation("setItem", key, value);

export const getDataInStorage = async (key: StoreKey) =>
  await performSecureStoreOperation("getItem", key);

export const removeDataInStorage = async (key: StoreKey) =>
  await performSecureStoreOperation("removeItem", key);

export const clearDataInStorage = async () =>
  await performSecureStoreOperation("clear");
