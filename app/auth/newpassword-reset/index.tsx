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
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const PasswordReset = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetEnabled, setIsResetEnabled] = useState(false);

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

  useEffect(() => {
    // Enable reset button only when both passwords are identical and not empty
    setIsResetEnabled(
      newPassword.length > 0 &&
        confirmPassword.length > 0 &&
        newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const handleReset = () => {
    if (isResetEnabled) {
      // Add logic to reset the password
      router.push("/auth/sign-in");
    }
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
              <Text className="text-lg font-bold mb-2">New Password</Text>
              <View className="flex-row items-center">
                <TextInput
                  style={{
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    marginBottom: 16,
                    flex: 1,
                    paddingRight: 40,
                  }}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-1/4"
                >
                  <Ionicons
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-lg font-bold mb-2">Confirm Password</Text>
              <View className="flex-row items-center">
                <TextInput
                  style={{
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#E5E5E5",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    marginBottom: 16,
                    flex: 1,
                    paddingRight: 40,
                  }}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/4"
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: isResetEnabled ? "#7980FF" : "#D3D3D3",
                  borderRadius: 9999,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
                onPress={handleReset}
                disabled={!isResetEnabled}
                activeOpacity={0.8}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PasswordReset;
