import React from "react";
import { TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface CustomButtonProps {
  flatlistIndex: SharedValue<number>;
  flatlistRef: React.RefObject<any>;
  datalength: number;
  x: SharedValue<number>;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  flatlistIndex,
  flatlistRef,
  datalength,
  x,
}) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const buttonAnimation = useAnimatedStyle(() => ({
    width:
      flatlistIndex.value === datalength - 1
        ? withSpring(195, { damping: 15, stiffness: 600 })
        : withSpring(60, { damping: 14, stiffness: 300 }),
    height: 60,
  }));

  const arrowAnimation = useAnimatedStyle(() => ({
    width: 24,
    height: 16,
    opacity:
      flatlistIndex.value === datalength - 1
        ? withTiming(0, { duration: 100 })
        : withTiming(1, { duration: 300 }),
    transform: [
      {
        translateX:
          flatlistIndex.value === datalength - 1
            ? withTiming(0, { duration: 300 })
            : withTiming(1, { duration: 300 }),
      },
    ],
  }));

  const textAnimation = useAnimatedStyle(() => ({
    opacity:
      flatlistIndex.value === datalength - 1
        ? withTiming(1, { duration: 300 })
        : withTiming(0, { duration: 100 }),
    transform: [
      {
        translateX:
          flatlistIndex.value === datalength - 1
            ? withTiming(0, { duration: 300 })
            : withTiming(-100, { duration: 100 }),
      },
    ],
  }));

  const isArabic = i18n.language === "ar";

  // Use the translation with fallback
  const buttonText = t("almost_there", {
    defaultValue:
      t("almost_there", {
        lng: "en",
      }) || "Almost there",
  });

  // // Debug logging
  // if (__DEV__) {
  //   console.log("Button translation:", buttonText);
  //   console.log("Current language:", i18n.language);
  // }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (flatlistIndex.value < datalength - 1) {
          flatlistRef.current?.scrollToIndex({
            index: flatlistIndex.value + 1,
          });
        } else {
          // Replace the current screen with login instead of pushing
          router.push("/login/login");
        }
      }}
    >
      <Animated.View
        className="absolute bottom-[80] w-[60] h-[60] bg-accent rounded-full items-center overflow-hidden justify-center"
        style={[buttonAnimation]}
      >
        {isArabic ? (
          <Animated.Text
            className="text-white font-cairo text-[18px] absolute"
            style={[textAnimation]}
          >
            {t("almost_there")}
          </Animated.Text>
        ) : (
          <Animated.Text
            className="text-white font-outfit text-[18px] absolute"
            style={[textAnimation]}
          >
            {t("almost_there")}
          </Animated.Text>
        )}
        <Animated.Image
          style={[arrowAnimation]}
          source={require("../../assets/images/arrow2.png")}
          className="w-6 h-4"
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;
