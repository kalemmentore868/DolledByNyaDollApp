import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenLayout = ({
  title,
  scroll = true,
  children,
}: {
  title: string;
  scroll?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <GestureHandlerRootView className="flex-1 bg-primary-100">
      <SafeAreaView className="flex-1 bg-primary-100">
        <View className="pt-2 pb-2 px-5 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-10 h-10 bg-primary-200 rounded-full items-center justify-center">
              <Image
                source={icons.backArrow}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </View>
          </TouchableOpacity>
          <Text className="text-xl font-JakartaSemiBold ml-5 ">{title}</Text>
        </View>

        {scroll ? (
          <ScrollView
            className="px-5"
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="px-5 flex-1">{children}</View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ScreenLayout;
