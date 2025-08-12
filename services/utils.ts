/* utils/authFetch.ts ------------------------------------------------------- */
import * as SecureStore from "expo-secure-store";

const baseUrl = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "CLERK_JWT"; // the same key you used in tokenCache

/* ------------------------------------------------------------------------ */
/* 1. Provide a way for the app to give us a fresh Clerk token              */
/* ------------------------------------------------------------------------ */

type TokenGetter = () => Promise<string | null>;

let pullFreshToken: TokenGetter | null = null;

export function registerTokenGetter(fn: TokenGetter) {
  pullFreshToken = fn;
}

/* ------------------------------------------------------------------------ */
/* 2. Helpers to read / write the cached token                              */
/* ------------------------------------------------------------------------ */

async function getCachedToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

async function cacheToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/* ------------------------------------------------------------------------ */
/* 3. Public fetch helpers                                                  */
/* ------------------------------------------------------------------------ */

export async function customBackEndFetch<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${baseUrl}/${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function customTokenFreeFetch<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${baseUrl}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

/* ---------- 🔐 MAIN util: automatically adds & refreshes Clerk JWT ------ */

export async function customAuthFetch<T = any>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  retry = true
): Promise<T> {
  let token = await getCachedToken();

  const makeRequest = async (jwt: string) => {
    return fetch(`${baseUrl}/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await makeRequest(token || "");
  if (!res.ok && res.status === 401 && retry && pullFreshToken) {
    console.warn("[AuthFetch] token expired ⇒ refreshing");
    const newToken = await pullFreshToken();
    if (!newToken) throw new Error("Unable to refresh token");

    await cacheToken(newToken);
    res = await makeRequest(newToken);
  }

  if (!res.ok) {
    const errObj = await res.json().catch(() => ({}));
    console.log("[AuthFetch] Error:", errObj);
    const msg = errObj.response?.data?.error?.message;
    throw new Error(msg);
  }
  return res.json();
}
