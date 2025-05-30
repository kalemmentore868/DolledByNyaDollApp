import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();

      router.push("/(auth)/signin");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="mt-6 rounded-xl bg-primary-500 px-5 py-3 active:opacity-90"
    >
      <Text className="text-center font-JakartaSemiBold text-base text-white">
        Sign out
      </Text>
    </TouchableOpacity>
  );
};
