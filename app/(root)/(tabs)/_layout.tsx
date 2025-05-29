import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

/* ---------- tiny helper ---------- */
const TabIcon = ({ source, focused }: { source: any; focused: boolean }) => (
  <View
    className={`items-center justify-center w-12 h-12 mt-10 rounded-full ${
      focused ? "bg-primary-400" : ""
    }`}
  >
    <Image
      source={source}
      style={{ width: 30, height: 30 }}
      resizeMode="contain"
      tintColor="white"
    />
  </View>
);

/* ---------- layout ---------- */
export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        /* distributes each item equally */
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },

        /* pill container */
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 40,

          backgroundColor: "#333333",
          borderTopWidth: 0, // remove default hairline
          paddingHorizontal: 24, // nice inner breathing room
        },

        tabBarShowLabel: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
