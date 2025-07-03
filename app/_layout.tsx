// app/_layout.tsx
// NO CHANGES NEEDED HERE based on the navigation issue. This file is correctly set up.
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, View, Text } from "react-native";
import React from "react";
import "./global.css"; // Assuming you have global CSS setup
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { TicketsProvider } from '@/context/TicketsContext';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Cairo-Regular": require("../assets/fonts/Cairo-Regular.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-ExtraLight": require("../assets/fonts/Cairo-ExtraLight.ttf"),
    "Cairo-Light": require("../assets/fonts/Cairo-Light.ttf"),
    "Cairo-Medium": require("../assets/fonts/Cairo-Medium.ttf"),
    "Cairo-SemiBold": require("../assets/fonts/Cairo-SemiBold.ttf"),
  });

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const item = {
    animation: require("../assets/images/animations/loading.json"),
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (isSplashVisible) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        <View className="flex-1 bg-white justify-center items-center">
          <View className="justify-center flex flex-row gap-3 items-center bg-transparent">
            <Text className="font-light text-2xl text-accent border-r px-2">LOGO</Text>
            <View className="flex-row gap-0 items-center"><Text className="font-medium text-2xl ">TASKAIL</Text></View>
          </View>
          <View style={{ position: "absolute", bottom: 30, alignSelf: "center" }}>
             {fontsLoaded && !fontError && (
              <LottieView source={item.animation} autoPlay loop style={{ width: 100, height: 100 }}/>
             )}
             {fontError && (<Text className="text-red-500 text-center text-xs">Font loading error</Text>)}
          </View>
        </View>
      </>
    );
  }

   if (!fontsLoaded && fontError && !isSplashVisible) {
     return (
        <View className="flex-1 justify-center items-center bg-white p-5">
            <Text className="text-red-600 text-lg text-center">
                Error: Could not load required fonts. Please restart the app or check font files.
            </Text>
            <Text className="text-red-600 text-sm mt-2">{fontError.message}</Text>
        </View>
     );
   }

  return (
    <TicketsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
            <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                {/* Ensure Notification page can be presented globally if needed outside specific stacks */}
                {/* It's often implicitly handled if pushed from anywhere within the Stack defined here */}
                <Stack.Screen name="(screen)/notification" options={{ 
                  // You can define presentation options here if needed, e.g., 'modal'
                  // presentation: 'modal', 
                }}/>
                <Stack.Screen name="ticket/[id]" />
                <Stack.Screen name="auth/sign-in/index" />
                <Stack.Screen name="auth/sign-up/index" />
                <Stack.Screen name="auth/newpassword-reset/index" />
                <Stack.Screen name="auth/reset-password/index" />
                <Stack.Screen name="auth/phone-verification/index" />
                <Stack.Screen name="auth/reset-email/index" />
                <Stack.Screen name="auth/reset-password-code/index" />
                <Stack.Screen name="auth/reset-phone/index" />
                <Stack.Screen name="auth/verify-code/index" />
                <Stack.Screen name="auth/verify-phone/index" />
            </Stack>
        </GestureHandlerRootView>
    </TicketsProvider>
  );
}