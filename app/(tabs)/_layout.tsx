// app/(tabs)/_layout.tsx
import { View, BackHandler, Alert } from "react-native";
import React, { useEffect } from "react";
import { Tabs, useRouter, useSegments } from "expo-router";

import { TabBar } from "@/components/TabBar/TabBar"; // Ensure path is correct
import { TabBarProvider } from "@/components/TabBar/TabBarContext"; // Ensure path is correct

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const handleBackPress = () => {
      console.log("TabsLayout Back Handler - Segments:", segments.join('/'));

      // This back handler should ONLY manage navigation when a tab screen is the TOPMOST active route.
      // If another screen (like NotificationPage) was pushed ON TOP of the tabs,
      // this handler should return `false` to let that screen's own back logic or the default system back handle it.

      if (segments[0] === '(tabs)') {
        const currentTab = segments[1];

        // If the current screen is a tab screen, but not the main 'dashboard' tab
        if (currentTab !== "dashboard") {
          console.log(`TabsLayout Back Handler: Not on dashboard tab (current: ${currentTab}). Navigating to dashboard.`);
          router.replace("/(tabs)/dashboard"); // Go to the primary tab
          return true; // Consume the back press event
        }
        
        // If on the primary 'dashboard' tab
        console.log("TabsLayout Back Handler: On dashboard tab. Asking to exit.");
        Alert.alert(
          "Exit App", 
          "Are you sure you want to exit the app?",
          [ 
            { text: "Cancel", style: "cancel" }, 
            { text: "Exit", onPress: () => BackHandler.exitApp() }, 
          ],
          { cancelable: true }
        );
        return true; // Consume the back press event (to show the Alert)
      }

      // If the current top screen is NOT a tab screen (e.g., NotificationPage, TicketDetailPage, Auth pages were pushed on top)
      // then this TabsLayout back handler should NOT interfere.
      // Let the screen itself or the default system/router mechanism handle the back press.
      console.log("TabsLayout Back Handler: Top screen is not a tab screen. Allowing default back behavior (returning false).");
      return false; 
    };

    const backHandlerSubscription = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => backHandlerSubscription.remove();

  }, [segments, router]); // Dependencies

  return (
    <TabBarProvider>
      <View className="flex-1 bg-white"> 
        <Tabs 
          screenOptions={{ 
            headerShown: false,
          }} 
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="note" />
          <Tabs.Screen name="create" />
          <Tabs.Screen name="inbox" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </TabBarProvider>
  );
}