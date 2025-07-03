import React, { useRef, useState, useEffect } from "react";
import { View, Text, Platform, BackHandler } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  runOnUI,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import Pagination from "@/components/WelcomePages/Pagination";
import { auth } from "../configs/FireBaseConfig";
import { User } from "firebase/auth";
import data from "../data/animation";
import RenderItem from "@/components/WelcomePages/RenderItem";
import { initializeI18n } from "./i18n/i18n.config";
import LottieView from "lottie-react-native";

const HAS_LAUNCHED = "HAS_LAUNCHED";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setCheckingAuth] = useState(true);
  const [isLanguageReady, setLanguageReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatlistRef = useAnimatedRef<Animated.FlatList<any>>();
  const x = useSharedValue(0);
  const flatlistIndex = useSharedValue(0);

  // Check if app has been launched before
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // If user is in auth screens and tries to go back, exit the app
        if (hasLaunched) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [hasLaunched]);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunchedBefore = await AsyncStorage.getItem(HAS_LAUNCHED);
      setHasLaunched(hasLaunchedBefore === "true");
    } catch (error) {
      console.error("Error checking first launch:", error);
      setHasLaunched(false);
    }
  };

  // Mark app as launched after onboarding
  const markAsLaunched = async () => {
    try {
      await AsyncStorage.setItem(HAS_LAUNCHED, "true");
      setHasLaunched(true);
    } catch (error) {
      console.error("Error marking app as launched:", error);
    }
  };

  // Check Authentication Status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const item = {
    animation: require("../assets/images/animations/loading.json"),
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

    // Language initialization
    useEffect(() => {
      const initLanguage = async () => {
        const timeout = setTimeout(() => {
          console.warn(
            "Language initialization timed out. Proceeding with fallback."
          );
          setLanguageReady(true);
        }, 5000);
  
        try {
          await initializeI18n();
          clearTimeout(timeout);
          setLanguageReady(true);
        } catch (error) {
          console.error("Failed to initialize language:", error);
          clearTimeout(timeout);
          setLanguageReady(true);
        }
      };
  
      initLanguage();
    }, []);
  
    // Show a loading screen while checking auth or initializing language
    if (isCheckingAuth || (!isLanguageReady && Platform.OS !== "ios")) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          className="bg-white"
        >
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      );
    }

  // Loading screen
  if (isCheckingAuth || hasLaunched === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        {/* <Text>Loading...</Text> */}
      </View>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Redirect href="../dashboard" />;
  }

  // If user has seen onboarding before, redirect to sign in
  if (hasLaunched) {
    return <Redirect href="/auth/sign-in" />;
  }

  // Show onboarding for first-time users
  return (
    <View className="flex-1 bg-white">
      {/* Logo Section */}
      <View className="absolute gap-3 top-[8%] justify-center w-full flex flex-row items-center bg-transparent">
        <Text className="font-light text-2xl text-accent border-r px-2">
          LOGO
        </Text>
        <View className="flex-row gap-0 items-center">
          <Text className="font-medium text-2xl">TASKAIL</Text>
        </View>
      </View>

      {/* Pagination */}
      <View
        className={`z-20 absolute w-full bg-black items-center ${
          Platform.OS === "ios" ? "bottom-[0]" : "bottom-[0]"
        }`}
      >
        <Pagination
          data={data}
          x={x}
          flatlistIndex={flatlistIndex}
          currentIndex={currentIndex}
        />
      </View>

      {/* Flatlist */}
      <Animated.FlatList
        style={{ backgroundColor: "transparent" }}
        ref={flatlistRef}
        data={data}
        onScroll={onScroll}
        renderItem={({ item, index }) => (
          <RenderItem
            item={item}
            index={index}
            x={x}
            flatlistRef={flatlistRef}
            flatlistIndex={flatlistIndex}
            datalength={data.length}
            onLastScreen={markAsLaunched}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        bounces={false}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems[0]?.index !== undefined) {
            requestAnimationFrame(() => {
              flatlistIndex.value = viewableItems[0].index ?? 0;
              setCurrentIndex(viewableItems[0].index ?? 0);
            });
          }
        }}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
      />
    </View>
  );
}
