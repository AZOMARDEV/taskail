import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const ResetPassword = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("");

  const showToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "bottom",
      visibilityTime: 1500,
      autoHide: true,
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back(); // Change this from router.back()
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleContinue = () => {
    if (!selectedMethod) {
      showToast("Please select a reset method");
      return;
    }

    if (selectedMethod === "email") {
      router.push("/auth/reset-email");
    } else {
      router.push("/auth/reset-phone");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View
        entering={
          Platform.OS === "android" ? SlideInRight.duration(300) : undefined
        }
        exiting={
          Platform.OS === "android" ? SlideOutLeft.duration(300) : undefined
        }
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="px-4 py-3 mb-7 pt-[30px] border-gray-300 border-b flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 bg-white rounded-full h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mr-8 text-center flex-1">
              Reset Password
            </Text>
          </View>

          <View className="px-6 flex-1">
            <Text className="text-gray-500 mb-8">
              Select a method to reset your password
            </Text>

            <View className="gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedMethod("email")}
                className={`border rounded-xl p-4 flex-row items-center ${
                  selectedMethod === "email"
                    ? "border-accent"
                    : "border-gray-200"
                }`}
              >
                <View className="w-10 h-10 bg-[#F5F7FF] rounded-full items-center justify-center">
                  <Ionicons name="mail-outline" size={20} color="#666" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-400">Email</Text>
                  <Text className="text-gray-900">***********@gmail.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedMethod("phone")}
                className={`border rounded-xl p-4 flex-row items-center ${
                  selectedMethod === "phone"
                    ? "border-accent"
                    : "border-gray-200"
                }`}
              >
                <View className="w-10 h-10 bg-[#F5F7FF] rounded-full items-center justify-center">
                  <Ionicons name="call-outline" size={20} color="#666" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-400">Phone Number</Text>
                  <Text className="text-gray-900">(***) ***-0120</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className={`rounded-full py-4 items-center mt-14 ${
                selectedMethod ? "bg-accent" : "bg-gray-300"
              }`}
              onPress={handleContinue}
              activeOpacity={0.9}
              disabled={!selectedMethod}
            >
              <Text className="text-white font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      <Toast />
    </SafeAreaView>
  );
};

export default ResetPassword;
