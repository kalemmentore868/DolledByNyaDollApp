// app/(tabs)/profile.tsx or similar
import { clearDataInStorage } from "@/storage/localStorage";
import { useUserStore } from "@/store"; // assumes setUser(null) is valid
import type { User } from "@/types/User"; // your User type above
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile: React.FC = () => {
  const router = useRouter();
  const { signOut, isSignedIn } = useAuth(); // Clerk Expo hook (signOut) — see docs
  const { user, setUser } = useUserStore();

  const displayName = useMemo(
    () => user?.name ?? user?.email ?? "Profile",
    [user]
  );

  const handleLogout = async () => {
    try {
      // 1) End Clerk session
      if (isSignedIn) {
        await signOut(); // Clerk handles token/session cleanup
      }

      // 2) Clear secure storage (your helper clears all keys you listed)
      await clearDataInStorage();

      // 3) Reset in-memory state
      setUser(null as unknown as User);

      // 4) Navigate to sign-in (replace so user can’t go “back” into the app)
      router.replace("/signin"); // adjust if your auth route differs
    } catch (e: any) {
      Alert.alert("Logout failed", e?.message ?? "Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{displayName}</Text>
        {!!user?.email && <Text style={styles.subtitle}>{user.email}</Text>}
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 20, justifyContent: "center" },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#1f2937",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 14, color: "#cbd5e1", marginTop: 6 },
  logoutBtn: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#ef4444",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
