import { useUserStore } from "@/store";
import { SignedIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const features = [
  {
    title: "Get Diagnosis",
    subtitle: "Personalized skin analysis",
    icon: "medkit-outline",
  },
  {
    title: "Consultation Booking",
    subtitle: "Schedule with our experts",
    icon: "calendar-outline",
  },
  {
    title: "Shop Products",
    subtitle: "Beauty & wellness items",
    icon: "bag-outline",
  },
  {
    title: "Your Body Goals",
    subtitle: "Based on your BMI",
    icon: "body-outline",
  },
  {
    title: "Diet & Weight Plans",
    subtitle: "Personalized for your body type",
    icon: "nutrition-outline",
  },
  {
    title: "Your Royalty Points",
    subtitle: "Earn discounts with purchases",
    icon: "star-outline",
  },
  {
    title: "Work With Dolled",
    subtitle: "Beauty & wellness job listings",
    icon: "briefcase-outline",
  },
];

export default function HomePage() {
  const { user } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-primary-100">
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <SignedIn>
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-JakartaBold text-gray-900">
              Hello, {user?.name?.split(" ")[0]}
            </Text>
          </View>

          <View className="space-y-5 gap-4 mb-30">
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.title}
                className="bg-primary-500 rounded-2xl px-5 py-6 shadow-md"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Ionicons
                      name={feature.icon as any}
                      size={28}
                      color="black"
                    />
                    <View>
                      <Text className="text-lg font-JakartaBold text-black">
                        {feature.title}
                      </Text>
                      <Text className="text-sm text-black">
                        {feature.subtitle}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="black" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </SignedIn>
      </ScrollView>
    </SafeAreaView>
  );
}
