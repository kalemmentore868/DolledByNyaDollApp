import { registerTokenGetter } from "@/services/utils";
import { getDataInStorage, STORAGE_NAMES } from "@/storage/localStorage";
import { useUserStore } from "@/store";
import { User } from "@/types/User";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { AppState, Platform } from "react-native";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 2,
    },
  },
});

function onAppStateChange(status: string) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const { user, setUser } = useUserStore();

  /* 1. expose a fresh JWT to your fetch helper */
  useEffect(() => {
    registerTokenGetter(() => getToken({ skipCache: true }));
  }, [getToken]);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) =>
      onlineManager.setOnline(!!state.isConnected)
    );
    const sub = AppState.addEventListener("change", onAppStateChange);
    return () => {
      unsub();
      sub.remove();
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const data = await getDataInStorage(STORAGE_NAMES.userProfile);
        if (data.success) {
          setUser(data.data as User);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProviders>
    </ClerkProvider>
  );
}
