import { View, TouchableOpacity, Platform, Animated, Keyboard } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { useTabBar } from "./TabBarContext"; // Import the context hook

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const { isTabBarVisible } = useTabBar(); // Get visibility state from context

  useEffect(() => {
    // Control visibility based on context value
    if (isTabBarVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 200, // Move tab bar off-screen
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isTabBarVisible]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      Animated.timing(translateY, {
        toValue: 0, // Adjust this value based on your needs
        duration: 0,
        useNativeDriver: true,
      }).start();
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });

    // For Android
    const showSubscriptionAndroid = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(translateY, {
        toValue: 200,
        duration: 0,
        useNativeDriver: true,
      }).start();
    });

    const hideSubscriptionAndroid = Keyboard.addListener('keyboardDidHide', () => {
      if (isTabBarVisible) { // Only show if context says it should be visible
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      showSubscriptionAndroid.remove();
      hideSubscriptionAndroid.remove();
    };
  }, [isTabBarVisible]);

  const colors = {
    primary: "#7980FF",
    accent: "white",
    accentHover: "#A2A7FF",
    accentLight: "#BCC0FF",
    accentDark: "#D7D9FF",
  };
  const icons: { [key: string]: (props: any) => JSX.Element } = {
    dashboard: (props: any) => (
      <MaterialCommunityIcons
        name="view-grid"
        size={26}
        color={props.focused ? colors.primary : "#9ca3af"}
      />
    ),
    note: (props: any) => (
      <MaterialCommunityIcons
        name="note-edit"
        size={26}
        color={props.focused ? colors.primary : "#9ca3af"}
      />
    ),
    create: (props: any) => (
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 9999,
          padding: 16,
          marginTop: Platform.OS === "ios" ? -69 : -59,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="add" size={40} color="white" />
      </View>
    ),
    inbox: (props: any) => (
      <MaterialCommunityIcons
        name="message-text"
        size={26}
        color={props.focused ? colors.primary : "#9ca3af"}
      />
    ),
    profile: (props: any) => (
      <FontAwesome
        name="user"
        size={26}
        color={props.focused ? colors.primary : "#9ca3af"}
      />
    ),
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: Platform.OS === "ios" ? 0 : 0,
        width: "100%",
        transform: [{ translateY }],
      }}
    >
      <View
        className="border border-b-0 gap-0 border-gray-200"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 14,
          paddingVertical: Platform.OS === "ios" ? 23 : 14,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: "white",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = icons[route.name] || (() => null);

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={route.key}
              onPress={onPress}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Icon focused={isFocused} />
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}