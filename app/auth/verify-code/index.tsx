import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, {
  SlideInRight,
  SlideOutLeft,
  runOnJS,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const VerifyCode = () => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const opacity = useSharedValue(0);

  const params = useLocalSearchParams();
  const { email, password, username } = params as {
    email: string;
    password: string;
    username: string;
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

  useEffect(() => {
    // Ensure component is fully mounted before showing
    const timeout = setTimeout(() => {
      setIsReady(true);
      opacity.value = withTiming(1, { duration: 300 });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const verifyCode = async () => {
    try {
      if (code.length !== 6) {
        Toast.show({
          type: "error",
          text1: "Please enter a valid 6-digit code",
          position: "bottom",
        });
        return;
      }

      router.push({
        pathname: "/auth/phone-verification",
        params: {
          email: encodeURIComponent(email),
          password: encodeURIComponent(password),
          username: encodeURIComponent(username),
        },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Verification failed",
        position: "bottom",
      });
    }
  };

  const resendCode = async () => {
    if (isResending) return;

    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    Toast.show({
      type: "success",
      text1: "New code sent successfully",
      position: "bottom",
    });

    setTimer(60);
    setIsResending(false);
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleNumberPress = (number: string | number) => {
    if (!isReady) return;
    if (code.length < 6) {
      setCode((prev) => prev + number);
    }
  };

  const handleBackspace = () => {
    if (!isReady) return;
    setCode((prev) => prev.slice(0, -1));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const NumberButton = React.memo(({ number }: { number: number }) => (
    <TouchableOpacity
      key={number}
      style={{
        width: "33.33%",
        paddingHorizontal: 8,
      }}
      onPress={() => handleNumberPress(number)}
      activeOpacity={0.7}
    >
      <View
        style={{
          height: 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 24 }}>{number}</Text>
      </View>
    </TouchableOpacity>
  ));

  if (!isReady) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Animated.View
          // style={[{ flex: 1 }]}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 28,
              paddingTop: Platform.OS === "ios" ? 100 : 30,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5E5",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                backgroundColor: "white",
                borderRadius: 20,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mr-8 text-center flex-1">
              Verify Code
            </Text>
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            <Text style={{ color: "#6B7280", marginBottom: 32 }}>
              Please enter the code we just sent to {email}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 32,
                gap: 12,
              }}
            >
              {[...Array(6)].map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 48,
                    height: 48,
                    borderWidth: 2,
                    borderColor: code[index] ? "#7980FF" : "#E5E5E5",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {code[index] || ""}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <TouchableOpacity
                onPress={timer === 0 ? resendCode : undefined}
                disabled={timer > 0}
              >
                <Text
                  style={{
                    color: timer > 0 ? "#9CA3AF" : "#7980FF",
                  }}
                >
                  Resend code in {formatTime(timer)}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                borderRadius: 9999,
                paddingVertical: 16,
                alignItems: "center",
                backgroundColor: code.length === 6 ? "#7980FF" : "#E5E5E5",
              }}
              onPress={verifyCode}
              disabled={code.length !== 6}
              activeOpacity={0.8}
            >
              <Text style={{ color: "white", fontWeight: "500" }}>
                Continue
              </Text>
            </TouchableOpacity>

            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3].map((num) => (
                  <NumberButton key={num} number={num} />
                ))}
              </View>

              <View style={{ flexDirection: "row" }}>
                {[4, 5, 6].map((num) => (
                  <NumberButton key={num} number={num} />
                ))}
              </View>

              <View style={{ flexDirection: "row" }}>
                {[7, 8, 9].map((num) => (
                  <NumberButton key={num} number={num} />
                ))}
              </View>

              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    width: "33.33%",
                    paddingHorizontal: 8,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      height: 80,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>.</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "33.33%",
                    paddingHorizontal: 8,
                  }}
                  onPress={() => handleNumberPress("0")}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      height: 80,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>0</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "33.33%",
                    paddingHorizontal: 8,
                  }}
                  onPress={handleBackspace}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      height: 80,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
        <Toast />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Animated.View
        // style={[{ flex: 1 }]}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 28,
            paddingTop: Platform.OS === "ios" ? 100 : 30,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E5E5",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              backgroundColor: "white",
              borderRadius: 20,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold mr-8 text-center flex-1">
            Verify Code
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: "#6B7280", marginBottom: 32 }}>
            Please enter the code we just sent to {email}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 32,
              gap: 12,
            }}
          >
            {[...Array(6)].map((_, index) => (
              <View
                key={index}
                style={{
                  width: 48,
                  height: 48,
                  borderWidth: 2,
                  borderColor: code[index] ? "#7980FF" : "#E5E5E5",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {code[index] || ""}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <TouchableOpacity
              onPress={timer === 0 ? resendCode : undefined}
              disabled={timer > 0}
            >
              <Text
                style={{
                  color: timer > 0 ? "#9CA3AF" : "#7980FF",
                }}
              >
                Resend code in {formatTime(timer)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              borderRadius: 9999,
              paddingVertical: 16,
              alignItems: "center",
              backgroundColor: code.length === 6 ? "#7980FF" : "#E5E5E5",
            }}
            onPress={verifyCode}
            disabled={code.length !== 6}
            activeOpacity={0.8}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>Continue</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3].map((num) => (
                <NumberButton key={num} number={num} />
              ))}
            </View>

            <View style={{ flexDirection: "row" }}>
              {[4, 5, 6].map((num) => (
                <NumberButton key={num} number={num} />
              ))}
            </View>

            <View style={{ flexDirection: "row" }}>
              {[7, 8, 9].map((num) => (
                <NumberButton key={num} number={num} />
              ))}
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  width: "33.33%",
                  paddingHorizontal: 8,
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: "33.33%",
                  paddingHorizontal: 8,
                }}
                onPress={() => handleNumberPress("0")}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>0</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: "33.33%",
                  paddingHorizontal: 8,
                }}
                onPress={handleBackspace}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="backspace-outline" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
      <Toast />
    </SafeAreaView>
  );
};

export default VerifyCode;
