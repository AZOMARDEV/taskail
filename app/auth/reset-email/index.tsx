import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const ResetEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

  const showToast = (message: string, type = "error") => {
    Toast.show({
      type: type,
      text1: message,
      position: "bottom",
      visibilityTime: 1500,
      autoHide: true,
    });
  };

  const handleSendLink = () => {
    if (!isEmailValid) {
      showToast("Please enter a valid email");
      return;
    }
    // Pass the email as a parameter in the router.push
    router.push({
      pathname: "/auth/reset-password-code",
      params: {
        email: encodeURIComponent(email),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
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
                Enter your email, we will send a verification code to email
              </Text>

              <View className="border border-gray-200 rounded-xl px-4 py-4 flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="gray" />
                <TextInput
                  placeholder="Enter your email"
                  className="flex-1 ml-2"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                onPress={handleSendLink}
                className={`bg-accent rounded-full py-4 items-center mt-14 ${
                  isEmailValid ? "bg-accent" : "bg-gray-300"
                }`}
                activeOpacity={0.9}
                disabled={!isEmailValid}
              >
                <Text className="text-white font-medium">Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default ResetEmail;
