import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View
        className="flex-1"
        exiting={
          Platform.OS === "android" ? SlideOutLeft.duration(300) : undefined
        }
        entering={
          Platform.OS === "android" ? SlideInRight.duration(300) : undefined
        }
      >
        {/* Header */}
        <View
          className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-300 ${
            Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
          }`}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center flex-1">
            Privacy Policy
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* First paragraph */}
          <Text className="text-gray-500 text-lg mt-6 mb-6">
            Not everyone knows how to make a Privacy Policy agreement,
            especially with CCPA or GDPR or CalOPPA or PIPEDA or Australia's
            Privacy Act provisions. If you are not a lawyer or someone who is
            familiar to Privacy Policies, you will be clueless. Some people
            might even take advantage of you because of this. Some people may
            even extort money from you. These are some examples that we want to
            stop from happening to you. We will help you protect yourself by
            generating a Privacy Policy.
          </Text>

          {/* Second paragraph */}
          <Text className="text-gray-500 text-lg mb-6">
            Our Privacy Policy Generator can help you make sure that your
            business complies with the law. We are here to help you protect your
            business, yourself and your customers.
          </Text>

          {/* Third paragraph */}
          <Text className="text-gray-500 text-lg mb-6">
            Fill in the blank spaces below and we will create a personalized
            website Privacy Policy for your business. No account registration
            required. Simply generate & download a Privacy Policy in seconds!
          </Text>

          {/* Repeated content from first paragraph */}
          <Text className="text-gray-500 text-lg mb-6">
            If you are not a lawyer or someone who is familiar to Privacy
            Policies, you will be clueless. Some people might even take
            advantage of you because of this. Some people may even extort money
            from you. These are some examples that we want to stop from
            happening to you. We will help you protect yourself by generating a
            Privacy Policy.
          </Text>

          {/* Repeated content from second paragraph */}
          <Text className="text-gray-500 text-lg mb-24">
            Our Privacy Policy Generator can help you make sure that your
            business complies with the law. We are here to help you protect your
            business, yourself and your customers.
          </Text>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
