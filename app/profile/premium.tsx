import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Box,
  Users,
  Upload,
} from "lucide-react-native";
import { router } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );

  const navigateBack = () => {
    router.back();
  };

  const handleStartTrial = () => {
    console.log("Starting 14-day trial");
    // Implement trial start logic
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Animated.View
        className="flex-1"
        exiting={
          Platform.OS === "android" ? SlideOutLeft.duration(300) : undefined
        }
        entering={
          Platform.OS === "android" ? SlideInRight.duration(300) : undefined
        }
      >
        <View
          className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 ${
            Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
          }`}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center flex-1 text-slate-800">
            Upgrade to Premium
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Text */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-xl text-gray-600">
              Get the premium feature and get the unlimited access to the app.
              Upgrade your account and get full access.
            </Text>
          </View>

          {/* Premium Features */}
          <View className="px-6 py-4">
            {/* Unlimited Projects */}
            <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mr-4">
                <Box size={28} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">
                  Unlimited Projects
                </Text>
                <Text className="text-gray-500">No limit projects</Text>
              </View>
            </View>

            {/* Unlimited Members */}
            <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mr-4">
                <Users size={28} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">
                  Unlimited Members
                </Text>
                <Text className="text-gray-500">
                  No limit member invitation
                </Text>
              </View>
            </View>

            {/* Unlimited file uploads */}
            <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mr-4">
                <Upload size={28} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-800">
                  Unlimited file uploads
                </Text>
                <Text className="text-gray-500">
                  No limit number of files and size
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 mx-6 my-2" />

          {/* Plans */}
          <View className="px-6 py-4">
            {/* Monthly Plan */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedPlan("monthly")}
              className={`flex-row justify-between items-center p-4 mb-4 rounded-2xl border-2 ${
                selectedPlan === "monthly"
                  ? "border-indigo-400"
                  : "border-gray-200"
              }`}
            >
              <View>
                <View className="flex-row items-center">
                  <Text className="text-xl font-semibold text-gray-800">
                    1 Month Plan
                  </Text>
                  <Text className="text-gray-500 ml-2">/ $ 6.99 only</Text>
                </View>
                <Text className="text-gray-500">
                  Billed monthly, Cancel anytime
                </Text>
              </View>

              <View
                className={`w-10 h-10 rounded-full ${
                  selectedPlan === "monthly" ? "bg-indigo-400" : "bg-gray-200"
                } items-center justify-center`}
              >
                {selectedPlan === "monthly" && (
                  <CheckCircle size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>

            {/* Yearly Plan */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedPlan("yearly")}
              className={`flex-row justify-between items-center p-4 rounded-2xl border-2 ${
                selectedPlan === "yearly"
                  ? "border-indigo-400"
                  : "border-gray-200"
              }`}
            >
              <View>
                <View className="flex-row items-center">
                  <Text className="text-xl font-semibold text-gray-800">
                    1 Year Plan
                  </Text>
                  <Text className="text-gray-500 ml-2">/ $ 60.99 only</Text>
                </View>
                <Text className="text-gray-500">
                  Billed yearly, Cancel anytime
                </Text>
              </View>

              <View
                className={`w-10 h-10 rounded-full ${
                  selectedPlan === "yearly" ? "bg-indigo-400" : "bg-gray-200"
                } items-center justify-center`}
              >
                {selectedPlan === "yearly" && (
                  <CheckCircle size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Trial Button */}
          <View className="px-6 mt-6 mb-10">
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-indigo-500 rounded-2xl py-4"
              onPress={handleStartTrial}
            >
              <Text className="text-center text-white font-medium text-xl">
                Start your 14-days trial
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
