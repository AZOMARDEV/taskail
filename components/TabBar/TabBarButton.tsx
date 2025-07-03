import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type TabBarButtonProps = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  label: string;
  Icon: React.ComponentType<{ focused: boolean; color: string }>;
};

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  label,
  Icon,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 400 }
    );
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.5]);
    const topValue = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top: topValue,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const bottomvalue = interpolate(scale.value, [0, 1], [0, -45]);
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      bottom: bottomvalue,
      opacity: opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 justify-center items-center"
    >
      <Animated.View style={animatedIconStyle}>
        <Icon focused={isFocused} color={isFocused ? "white" : "gray"} />
      </Animated.View>
      <Animated.Text
        style={[
          {
            color: isFocused ? "white" : "gray",
            fontFamily: "outfit-light",
            fontSize: 12,
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
