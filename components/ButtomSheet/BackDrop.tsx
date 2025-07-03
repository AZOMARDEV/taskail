import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  topAnimation: SharedValue<number>;
  closeHeight: number;
  openHeight: number;
  close: () => void;
};

const BackDrop = ({ topAnimation, closeHeight, openHeight, close }: Props) => {
  const backdropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      topAnimation.value,
      [closeHeight, openHeight],
      [0, 0.5]
    );
    const display = opacity === 0 ? "none" : "flex";
    return {
      opacity,
      display,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        close();
      }}
    >
      <Animated.View
        style={[{ display: "none", zIndex: 20 }, backdropAnimation]}
        className="absolute w-full h-full bg-black/50"
      ></Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default BackDrop;
