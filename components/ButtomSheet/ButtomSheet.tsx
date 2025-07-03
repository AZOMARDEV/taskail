import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import BackDrop from "./BackDrop";
import i18n, { setLanguage } from "@/app/i18n/i18n.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = { snapTo: string };

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(
  ({ snapTo }: Props, ref) => {
    const { height } = Dimensions.get("window");
    const closeHeight = height + 100;
    const percentage = parseFloat(snapTo.replace("%", "")) / 100;
    const openHeight = height - height * percentage;

    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

    // Expand and Close methods
    const expand = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(openHeight, { duration: 300 });
    }, [topAnimation, openHeight]);

    const close = useCallback(() => {
      "worklet";
      topAnimation.value = withTiming(closeHeight, { duration: 300 });
    }, [topAnimation, closeHeight]);

    useImperativeHandle(ref, () => ({ expand, close }));

    // Animated style for the bottom sheet
    const AnimationStyle = useAnimatedStyle(() => ({
      top: topAnimation.value,
      position: "absolute",
      width: "100%",
      height: "100%",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      zIndex: 20,
    }));

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        topAnimation.value = withSpring(
          event.translationY < 0
            ? openHeight
            : event.translationY + context.value,
          {
            damping: 100,
            stiffness: 400,
          }
        );
      })
      .onEnd(() => {
        topAnimation.value = withSpring(
          topAnimation.value > openHeight + 100 ? closeHeight : openHeight,
          {
            damping: 100,
            stiffness: 400,
          }
        );
      });

    // Change language
    const changeLanguage = async (lang: string) => {
      try {
        setSelectedLanguage(lang);
        await setLanguage(lang);
        close();
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    };

    // Fetch language on mount
    useEffect(() => {
      const fetchLanguage = async () => {
        try {
          const storedLanguage = await AsyncStorage.getItem("appLanguage");
          setSelectedLanguage(storedLanguage || i18n.language || "en");
        } catch (error) {
          console.error("Failed to fetch language:", error);
        }
      };

      fetchLanguage();
    }, []);

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          closeHeight={closeHeight}
          openHeight={openHeight}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View style={AnimationStyle} className="bg-white">
            <View className="items-center mt-3">
              <View className="w-16 h-1 bg-accent rounded-xl" />
              <View className="flex-col items-center justify-center gap-3 mt-8">
                {["fr", "ar", "en"].map((lang) => (
                  <TouchableWithoutFeedback
                    key={lang}
                    onPress={() => changeLanguage(lang)}
                  >
                    <View
                      className={`border items-center justify-center rounded-full w-[250] p-3 ${
                        selectedLanguage === lang
                          ? "bg-accent text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <Text
                        className={`text-2xl ${
                          selectedLanguage === lang
                            ? "font-outfit text-white"
                            : "font-outfit text-black"
                        }`}
                      >
                        {lang === "fr"
                          ? "Français"
                          : lang === "ar"
                          ? "العربية"
                          : "English"}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

export default BottomSheet;
