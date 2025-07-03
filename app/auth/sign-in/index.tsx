import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FireBaseConfig";
import { useTranslation } from "react-i18next";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const showToast = (message: string, type = "error") => {
  Toast.show({
    type: type,
    text1: message,
    position: "bottom",
    // adjust the color of the toast
    visibilityTime: 1500,
    autoHide: true,
  });
};

const SignIn = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackPress();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    if (Platform.OS === "ios") {
      // For iOS, we can't directly exit the app, so we'll just show a toast
      showToast("Press home button to exit", "info");
    } else {
      // For Android, exit the app
      BackHandler.exitApp();
    }
  };
  const signIn = () => {
    if (!email || !password) {
      showToast(t("sign_up.Please_fill_all_fields"));
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showToast("Sign in successful", "success");
        const user = userCredential.user;
        router.replace("../../dashboard");
        // Add navigation logic here
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode === "auth/user-not-found") {
          showToast("User not found");
        } else if (errorCode === "auth/wrong-password") {
          showToast("Wrong password");
        } else if (errorCode === "auth/invalid-email") {
          showToast("Invalid email");
        } else if (errorCode === "auth/invalid-credential") {
          showToast("Invalid credential");
        }
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
                  onPress={handleBackPress}
                  className="w-10 bg-white rounded-full h-10 items-center justify-center"
                >
                  <Ionicons name="arrow-back" size={30} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold mr-8 text-center flex-1">
                  Sign In
                </Text>
              </View>

              <View className="px-6 flex-1">
                <Text className="text-gray-500 mb-8">
                  Give credential to sign in your account
                </Text>

                <View className="gap-4">
                  <View
                    style={{ paddingVertical: 16 }}
                    className="border border-gray-200 rounded-xl px-4 flex-row items-center"
                  >
                    <Ionicons name="mail-outline" size={20} color="gray" />
                    <TextInput
                      placeholder="Type your email"
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
                      placeholder="Type your password"
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

                <TouchableOpacity
                  className="items-end mt-2"
                  activeOpacity={0.8}
                  onPress={() => router.push("/auth/reset-password")}
                >
                  <Text className="text-accent">Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-accent rounded-full py-4 items-center mt-14"
                  onPress={signIn}
                  activeOpacity={0.9}
                >
                  <Text className="text-white font-medium">Sign In</Text>
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

                <View className="flex-row justify-center mt-10">
                  <Text className="text-gray-500">Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/auth/sign-up")}
                    activeOpacity={0.5}
                  >
                    <Text className="text-accent">Sign Up</Text>
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

export default SignIn;
