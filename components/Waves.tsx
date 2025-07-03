import React from "react";
import { View, Dimensions, Platform } from "react-native";
import Svg, { Path, Defs, Use, G } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const WavesBackground = () => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    // Remove Platform check to enable animation on all platforms
    translateX.value = withRepeat(
      withTiming(-width, {
        duration: 20000,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const colors = {
    primary: "#7980FF",
    accent: "white",
    accentHover: "#A2A7FF",
    accentLight: "#BCC0FF",
    accentDark: "#D7D9FF",
  };

  const wavePath = `M-50 20 
    Q ${width * 0.25} 0, ${width * 0.5} 30 
    T ${width} 30 
    T ${width * 1.5} 40 
    T ${width * 2 + 100} 60 
    V ${height * 0.5} 
    H -50 
    Z`;

  return (
    <View
      style={{
        // position: "absolute",
        width: "100%",
        bottom: 0,
        left: 0,
        height: height * 0.2,
        backgroundColor: "transparent",
        zIndex: 1,
      }}
    >
      <AnimatedSvg
        height="100%"
        width={width * 2.2}
        viewBox={`-50 0 ${width * 2.2} ${height * 0.5}`}
        style={animatedStyle} // Apply animation to all platforms
        preserveAspectRatio="xMinYMin slice"
      >
        <Defs>
          <Path id="wave" d={wavePath} />
        </Defs>
        <G>
          <Use href="#wave" fill={colors.accentDark} opacity="0.1" />
          <Use href="#wave" y="-12" fill={colors.primary} opacity="0.2" />
          <Use href="#wave" y="-3" fill={colors.accent} opacity="1" />
          <Use href="#wave" y="-3" fill={colors.primary} opacity="0.5" />
          <Use href="#wave" y="2" fill={colors.primary} opacity="0.8" />
          <Use href="#wave" y="5" fill={colors.accent} opacity="1" />
          <Use href="#wave" y="7" fill={colors.primary} opacity="1" />
          <Use href="#wave" y="10" fill={colors.accent} opacity="1" />
          <Use href="#wave" y="12" fill={colors.primary} opacity="1" />
          <Use href="#wave" y="15" fill={colors.primary} />
        </G>
      </AnimatedSvg>
    </View>
  );
};

export default WavesBackground;