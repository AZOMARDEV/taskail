import React from "react";

import { Image, Text, TouchableOpacity, View } from "react-native";

import { LAYOUT_CONSTANTS } from "./constants";

import { Bell } from "lucide-react-native";

import { router } from "expo-router";

export const DashboardHeader: React.FC<{
  userName: string;

  profileImage?: string;

  onNotificationPress?: () => void;
}> = ({ userName, profileImage, onNotificationPress }) => {
  const handleNotificationPress = () => {
    // Navigate to notification page

    router.push("/(screen)/notification");

    // Also call the provided handler if any

    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  return (
    <View className="w-full justify-center z-10 mt-6 mb-9 pt-11">
      <View className="flex-row justify-between gap-3 items-center">
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-gray-200 rounded-full mr-4 relative">
            <Image
              source={{
                uri: profileImage || "https://via.placeholder.com/150",
              }}
              className="w-full h-full rounded-full"
            />

            <View className="absolute top-1 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-accent" />
          </View>

          <View>
            <Text className="text-white font-bold text-[20px]">{userName}</Text>

            <Text className="text-white font-extralight text-[12px]">
              Hi {userName}, Good Morning!
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-14 h-14 border bg-accent border-black/20 rounded-full items-center justify-center"
          activeOpacity={0.8}
          onPress={handleNotificationPress}
        >
          <Bell color="white" size={LAYOUT_CONSTANTS.iconSize.large} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
