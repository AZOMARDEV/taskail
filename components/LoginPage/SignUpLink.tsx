import { View, Text } from "react-native";
import React from "react";

type Props = {};

const SignUpLink = (props: Props) => {
  return (
    <View className="absolute bottom-[7%] items-center justify-center flex-row ">
      <Text className="font-outfit-extra-light">Don’t have an account?</Text>
      <Text className="font-outfit-bold text-black"> Sign up</Text>
    </View>
  );
};

export default SignUpLink;
