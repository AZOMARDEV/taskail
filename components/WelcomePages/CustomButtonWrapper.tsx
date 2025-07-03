import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import CustomButton from "./CustomButton";

interface CustomButtonWrapperProps {
  flatlistIndex: SharedValue<number>;
  flatlistRef: React.RefObject<any>;
  datalength: number;
  x: SharedValue<number>;
}

const CustomButtonWrapper: React.FC<CustomButtonWrapperProps> = ({
  flatlistIndex,
  flatlistRef,
  datalength,
  x,
}) => {
  return (
    <CustomButton
      flatlistIndex={flatlistIndex}
      flatlistRef={flatlistRef}
      datalength={datalength}
      x={x}
      onPress={() => {}}
    />
  );
};

export default CustomButtonWrapper;
