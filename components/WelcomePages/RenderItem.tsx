import React, { useCallback, useMemo, useState } from "react";
import { View, Text, useWindowDimensions, Platform } from "react-native";
import LottieView from "lottie-react-native";
import Animated, { SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

interface RenderItemProps {
  item: any;
  index: number;
  x: SharedValue<number>;
  flatlistRef: React.RefObject<any>;
  flatlistIndex: SharedValue<number>;
  datalength: number;
  onLastScreen?: () => void; // New prop
}

const RenderItem: React.FC<RenderItemProps> = React.memo(
  ({
    item,
    index,
    x,
    flatlistRef,
    flatlistIndex,
    datalength,
    onLastScreen,
  }) => {
    const { width, height } = useWindowDimensions();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const isLastScreen = index === 3;
    const isThirdScreen = index === 2;

    const customLottieSize = useMemo(() => {
      if (isLastScreen) {
        return { width: width * 0.9, height: height * 0.4, top: height * 0.05 };
      }
      return isThirdScreen
        ? { width: width * 0.75, height: height * 0.85, top: height * 0.12 }
        : { width: width * 0.95, height: height * 1.1, top: height * 0.001 };
    }, [index, width, height, isLastScreen]);

    const isArabic = i18n.language === "ar";

    const handleNextScreen = useCallback(() => {
      const nextIndex = index + 1;
      if (nextIndex < datalength) {
        flatlistRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, [index, datalength, flatlistRef]);

    // Use useAnimatedReaction for any logic that needs to react to flatlistIndex
    useAnimatedReaction(
      () => flatlistIndex.value,
      (currentIndex) => {
        // Any reactions to index changes can go here
      },
      [flatlistIndex]
    );

    // Remove useFocusEffect if it's not absolutely necessary
    // If you need it, modify it to use local state instead:
    const [hasReset, setHasReset] = useState(false);
    useFocusEffect(
      useCallback(() => {
        if (!hasReset) {
          flatlistRef.current?.scrollToIndex({ index: 0, animated: false });
          setHasReset(true);
        }
        return () => {};
      }, [hasReset])
    );

    const handleSignIn = () => {
      onLastScreen?.(); // Mark as launched before navigation
      router.push("/auth/sign-in");
    };

    const handleSignUp = () => {
      onLastScreen?.(); // Mark as launched before navigation
      router.push("/auth/sign-up");
    };

    const signUpButton = () => {
      if (isLastScreen) {
        return (
          <View
            style={{
              ...(Platform.OS === "ios" ? { marginBottom: height * 0.1 } : {}),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 320,
                height: 60,
                backgroundColor: "white",
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                ...(Platform.OS === "ios" ? {} : { bottom: height * 0.1 }),
              }}
              onPress={handleSignUp}
            >
              <Text className="text-accent font-medium text-base">
                {t("login.sign_up")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }
    };

    const renderButton = () => {
      if (isLastScreen) {
        return (
          <View
            className="flex gap-4 items-center w-full px-8"
            style={{
              ...(Platform.OS === "ios" ? { marginBottom: height * 0.2 } : {}),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 320,
                height: 60,
                borderRadius: 30,
                borderWidth: 2,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
                ...(Platform.OS === "ios" ? {} : { bottom: height * 0.195 }),
              }}
              onPress={handleSignIn}
            >
              <Text className="text-white font-medium text-base">
                {t("login.login")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      if (isThirdScreen) {
        return (
          <View
            style={{
              ...(Platform.OS === "ios" ? { marginBottom: height * 0.1 } : {}),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 195,
                height: 60,
                borderRadius: 30,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                ...(Platform.OS === "ios" ? {} : { bottom: height * 0.1 }),
              }}
              onPress={handleNextScreen}
            >
              <Text className="text-accent font-medium text-[17px] text-center">
                {t("login.get_started")}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View
          style={{
            ...(Platform.OS === "ios" ? { marginBottom: height * 0.1 } : {}),
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              ...(Platform.OS === "ios" ? {} : { bottom: height * 0.1 }),
            }}
            onPress={handleNextScreen}
          >
            <Animated.Image
              source={require("../../assets/images/arrow1.png")}
              style={{ width: 28, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          className="flex-1 justify-between gap-20 items-center"
          style={{ width, height }}
        >
          {isLastScreen ? (
            <View className="w-full h-[32%] bg-transparent p-9 top-[10%] justify-center items-center">
              <Text className="text-white bg-accent p-6 rounded-3xl text-center font-bold text-[20px] px-14">
                Add relevant content here
              </Text>
            </View>
          ) : (
            <Animated.View
              pointerEvents="box-none"
              className="w-full h-[45%] bottom-[19%] justify-items-start items-center"
            >
              <LottieView
                source={item.animation}
                loop
                autoPlay
                style={customLottieSize}
              />
            </Animated.View>
          )}

          <View
            className={`rounded-t-[48] border-[8px] border-white ${
              isLastScreen ? "h-[68%]" : "h-[55%]"
            } flex justify-start items-center w-full bg-accent pt-9 relative`}
          >
            <View className="flex gap-7">
              <Text className="text-white text-center font-bold text-[32px] px-11">
                {t(item.textHeader || "")}
              </Text>

              <Text
                className={`text-center text-white ${
                  isArabic
                    ? "font-cairo-light text-[20px]"
                    : "font-extralight text-[14px]"
                } px-11 leading-[1.6]`}
              >
                {t(item.textKey)}
              </Text>
            </View>

            <View className="absolute bottom-[10%]">{signUpButton()}</View>
            <View className="absolute bottom-[10%]">{renderButton()}</View>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }
);

export default RenderItem;
