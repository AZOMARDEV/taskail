import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FireBaseConfig";
import { useTranslation } from "react-i18next";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const showToast = (message: string, type = "error") => {
  Toast.show({
    type: type,
    text1: message,
    position: "bottom",
    visibilityTime: 1500,
    autoHide: true,
  });
};

const SignUp = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validatePassword = () => {
    return (
      password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password)
    );
  };

  const colors = {
    primary: "#7980FF",
    accent: "white",
    accentHover: "#A2A7FF",
    accentLight: "#BCC0FF",
    accentDark: "#D7D9FF",
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push("/auth/sign-in"); // Change this from router.back()
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const signUp = () => {
    if (!username || !email || !password) {
      showToast(t("sign_up.Please_fill_all_fields"));
      return;
    }

    if (!validatePassword()) {
      showToast("Password doesn't meet requirements");
      return;
    }

    if (!agreeToTerms) {
      showToast("Please agree to Terms of Service");
      return;
    }

    // Use router.push with properly encoded parameters
    router.push({
      pathname: "/auth/verify-code",
      params: {
        email: encodeURIComponent(email),
        password: encodeURIComponent(password),
        username: encodeURIComponent(username),
      },
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Animated.View
          exiting={
            Platform.OS === "android" ? SlideOutLeft.duration(300) : undefined
          }
          entering={
            Platform.OS === "android" ? SlideInRight.duration(300) : undefined
          }
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: "white",
                paddingBottom: 50,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="px-4 py-3 mb-7 pt-[30px] border-gray-300 border-b flex-row items-center">
                <TouchableOpacity
                  onPress={() => router.push("/auth/sign-in")} // Change this from router.back()
                  className="w-10 bg-white rounded-full h-10 items-center justify-center"
                >
                  <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold mr-8 text-center flex-1">
                  Create Account
                </Text>
              </View>

              <View className="px-6 flex-1">
                <Text className="text-gray-500 mb-8">
                  Create account and enjoy all services
                </Text>

                <View className="gap-4">
                  <View
                    style={{ paddingVertical: 16 }}
                    className="border border-gray-200 rounded-xl px-4 flex-row items-center"
                  >
                    <Ionicons name="person-outline" size={20} color="gray" />
                    <TextInput
                      placeholder="Username"
                      className="flex-1 ml-2"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>

                  <View
                    style={{ paddingVertical: 16 }}
                    className="border border-gray-200 rounded-xl px-4 flex-row items-center"
                  >
                    <Ionicons name="mail-outline" size={20} color="gray" />
                    <TextInput
                      placeholder="Email"
                      style={{ flex: 1, marginLeft: 8 }}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View
                    style={{ paddingVertical: 16 }}
                    className="border border-gray-200 rounded-xl px-4 flex-row items-center"
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="gray"
                    />
                    <TextInput
                      placeholder="Password"
                      className="flex-1 ml-2"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="gray"
                      />
                    </Pressable>
                  </View>
                </View>

                {password && (
                  <View className="mt-2 gap-1">
                    {validatePassword() ? (
                      <View className="flex-row items-center">
                        <Ionicons
                          name={password.length >= 8 ? "checkmark" : "close"}
                          size={16}
                          color={password.length >= 8 ? "green" : "red"}
                        />
                        <Text className="ml-2 text-gray-500">
                          Cool! You have a very strong password{" "}
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View className="flex-row items-center">
                          <Ionicons
                            name={password.length >= 8 ? "checkmark" : "close"}
                            size={16}
                            color={password.length >= 8 ? "green" : "red"}
                          />
                          <Text className="ml-2 text-gray-500">
                            Minimum 8 characters
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons
                            name={/\d/.test(password) ? "checkmark" : "close"}
                            size={16}
                            color={/\d/.test(password) ? "green" : "red"}
                          />
                          <Text className="ml-2 text-gray-500">
                            At least 1 number (1-9)
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons
                            name={
                              /[a-zA-Z]/.test(password) ? "checkmark" : "close"
                            }
                            size={16}
                            color={/[a-zA-Z]/.test(password) ? "green" : "red"}
                          />
                          <Text className="ml-2 text-gray-500">
                            At least one lowercase or uppercase letter
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                )}

                <View className="flex-row items-center p-3 mt-4">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                    className="mr-2"
                  >
                    <View className="w-7 h-7 border border-gray-300 rounded">
                      {agreeToTerms && (
                        <Ionicons
                          name="checkmark"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text className="text-gray-500 font-light">
                    I agree to the company{" "}
                    <Text className="text-accent font-light">
                      Term of Service
                    </Text>{" "}
                    and{" "}
                    <Text className="text-accent font-light">
                      Privacy Policy
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-accent rounded-full py-4 items-center mt-14"
                  onPress={signUp}
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-medium">Sign Up</Text>
                </TouchableOpacity>

                <View className="flex-row items-center mt-8">
                  <View className="flex-1 h-[1px] bg-gray-200" />
                  <Text className="mx-4 text-gray-500">or continue with</Text>
                  <View className="flex-1 h-[1px] bg-gray-200" />
                </View>

                <View className="flex-row justify-center mt-8 gap-6">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-16 h-16 border border-gray-200 rounded-2xl items-center justify-center"
                  >
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-16 h-16 border border-gray-200 rounded-2xl items-center justify-center"
                  >
                    <Ionicons name="logo-google" size={24} color="#DB4437" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-16 h-16 border border-gray-200 rounded-2xl items-center justify-center"
                  >
                    <Ionicons name="logo-apple" size={24} color="black" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-8">
                  <Text className="text-gray-500">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/auth/sign-in")}
                    activeOpacity={0.5}
                  >
                    <Text className="text-accent">Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </Animated.View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default SignUp;
