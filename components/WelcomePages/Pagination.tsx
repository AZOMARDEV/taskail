import React, { useMemo } from "react";
import { View } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import Dot from "./Dot";
import { useWindowDimensions } from "react-native";

interface PaginationProps {
  data: any[];
  x: SharedValue<number>;
  flatlistIndex: SharedValue<number>;
  currentIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, x, flatlistIndex, currentIndex }) => {
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        position: "absolute",
        bottom:  height * 0.005,
        width: "100%",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", height: 50 }}>
        {data.map((_, index) => (
          <Dot key={index} index={index} x={x} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(Pagination);