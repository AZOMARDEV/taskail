import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";

type Props = {};

const LoginButton = (props: Props) => {
  return (
    <TouchableWithoutFeedback>
      <View className="absolute bottom-[86] w-[160] h-[70] bg-accent rounded-full items-center overflow-hidden justify-center">
        <Text className="text-black font-outfit-medium text-[16px]">Login</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginButton;
