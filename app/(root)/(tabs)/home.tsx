import { SignOutButton } from "@/components/SignOutButton";
import { useUserStore } from "@/store";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { user } = useUserStore();

  return (
    <SafeAreaView>
      <SignedIn>
        <Text className="text-red">Hello {user?.name}</Text>
      </SignedIn>
      <SignOutButton />
      <SignedOut>
        <Link href="/(auth)/signin">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signup">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}
