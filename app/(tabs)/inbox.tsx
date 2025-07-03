// InboxPage.tsx (Relevant parts updated)
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  ActivityIndicator, // Import ActivityIndicator for loading
} from "react-native";
import { ArrowLeft, Search, Menu } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router"; // Import useFocusEffect

import { Message } from "@/components/Inbox/types/Message";
import Header from "@/components/Inbox/Header";
import EmptyState from "@/components/Inbox/EmptyState";
import MessageItem from "@/components/Inbox/MessageItem";
import Sidebar from "@/components/Inbox/Sidebar";
import { fetchMockMessages } from "@/components/Inbox/services/messageService";
import { useTabBar } from "@/components/TabBar/TabBarContext";

// Define Filter Types
export type ActiveFilter =
  | { type: "folder"; value: "inbox" | "starred" | "sent" | "draft" | "trash" }
  | { type: "category"; value: string }
  | { type: "all" }; // Could be useful

export default function InboxPage() {
  const [allMessages, setAllMessages] = useState<Message[]>([]); // Store all fetched messages
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { setIsTabBarVisible } = useTabBar();

  // --- New State for Filtering ---
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({
    type: "folder",
    value: "inbox",
  });

  // --- Removed showEmptyState, derive from filteredMessages length ---

  // Sidebar animation
  const sidebarAnim = React.useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;
  const sidebarWidth = screenWidth * 0.75;

  const closeSidebar = useCallback(() => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarOpen(false);
      // Show tab bar ONLY if search is not focused
      if (!isSearchFocused) {
        // Need a state to track search focus
        setIsTabBarVisible(true);
      }
    });
  }, [sidebarAnim, setIsTabBarVisible]); // Add dependencies

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    setIsTabBarVisible(false); // Hide tab bar when sidebar is open
    setTimeout(() => {
      // Small delay
      Animated.timing(sidebarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 10);
  }, [sidebarAnim, setIsTabBarVisible]); // Add dependencies

  const toggleSidebar = () => {
    if (sidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  // Function to fetch ALL messages
  const fetchAllMessages = async () => {
    setLoading(true);
    try {
      const allData = await fetchMockMessages();
      setAllMessages(allData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setAllMessages([]); // Set empty on error
    } finally {
      setLoading(false);
    }
  };

  // Load all messages only once on mount
  useEffect(() => {
    fetchAllMessages();
  }, []);

  // Manage tab bar visibility based on focus
  useFocusEffect(
    useCallback(() => {
      // When the screen comes into focus
      // Show tab bar initially, unless sidebar is intended to be open
      if (!sidebarOpen) {
        // Check sidebar state
        setIsTabBarVisible(true);
      }

      return () => {
        // Optional: Actions when the screen goes out of focus
        // setIsTabBarVisible(true); // Might be needed depending on nav structure
      };
    }, [sidebarOpen]) // Re-run if sidebarOpen changes while focused
  );

  // --- Update startNewDiscussion to navigate ---
  const startNewDiscussion = () => {
    setSidebarOpen(false); // Close sidebar if open
    setIsTabBarVisible(false); // Hide tab bar before navigating away
    router.push("/new-chat"); // Navigate to new chat contact selection screen
  };

  // --- Enhanced Filtering Logic ---
  const filteredMessages = allMessages.filter((message) => {
    // Apply Active Filter
    let matchesFilter = false;
    switch (activeFilter.type) {
      case "folder":
        if (activeFilter.value === "inbox")
          matchesFilter = message.status === "inbox";
        else if (activeFilter.value === "starred")
          matchesFilter = !!message.isStarred && message.status !== "trash";
        // Starred can be in inbox/sent etc. but not trash
        else if (activeFilter.value === "sent")
          matchesFilter = message.status === "sent";
        else if (activeFilter.value === "draft")
          matchesFilter = message.status === "draft";
        else if (activeFilter.value === "trash")
          matchesFilter = message.status === "trash";
        else matchesFilter = true; // Should not happen with defined types
        break;
      case "category":
        matchesFilter =
          message.category === activeFilter.value && message.status !== "trash"; // Filter by category, exclude trash
        break;
      case "all": // If you add an 'all' filter option
        matchesFilter = true;
        break;
      default:
        matchesFilter = true; // Default to showing if filter type is unknown
    }

    // Apply Search Query (only if matches filter)
    if (!matchesFilter) {
      return false;
    }

    if (!searchQuery) {
      return true; // No search query, return if filter matches
    }

    const query = searchQuery.toLowerCase();
    return (
      message.sender.toLowerCase().includes(query) ||
      message.project.toLowerCase().includes(query) ||
      message.content.toLowerCase().includes(query)
    );
  });

  const handleMessagePress = (message: Message) => {
    console.log("Navigating to chat for message:", message.id);
    setIsTabBarVisible(false); // Hide tab bar before navigating
    router.push({
      pathname: `/chat/[chatId]`, // Use predefined route
      params: {
        chatId: message.id.toString(), // Ensure chatId is string
        sender: message.sender,
        project: message.project,
        content: message.content, // Pass the message content
        isOnline: message.online ? "true" : "false", // Pass as string
        lastMessageTimestamp:
          message.timestamp?.toISOString() || new Date().toISOString(), // Pass timestamp as ISO string
        // **** ADDED LINE: Pass attachment status ****
        hasAttachment: message.hasAttachment ? "true" : "false", // Pass as string
      },
    });
  };

  // --- Handle Filter Change from Sidebar ---
  const handleChangeFilter = (newFilter: ActiveFilter) => {
    setActiveFilter(newFilter);
    closeSidebar(); // Close sidebar after selecting a filter
    // Reset search when changing main filter? Optional.
    // setSearchQuery("");
  };

  // State to track search input focus
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Overlay opacity
  const overlayOpacity = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Sidebar translation from right
  const sidebarTranslate = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sidebarWidth, 0],
  });

  // Determine if the empty state should be shown
  const shouldShowEmptyState =
    !loading && filteredMessages.length === 0 && !searchQuery;
  // Determine if "No results" for search should be shown
  const showNoResults =
    !loading && filteredMessages.length === 0 && searchQuery.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <Header onMenuPress={toggleSidebar} />

      {/* Search Bar Moved Up */}
      <View className="mx-4 my-4">
        {/* Adjusted margin */}
        <View className="flex-row items-center justify-center px-4 py-3 bg-gray-100 rounded-2xl">
          <Search size={30} color="#6B7280" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search conversations..." // Updated placeholder
            placeholderTextColor="#6B7280"
            className="flex-1 ml-2 text-base text-gray-700"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => {
              setIsSearchFocused(true);
              setIsTabBarVisible(false); // Hide tab bar when search is focused
            }}
            onBlur={() => {
              setIsSearchFocused(false);
              // Show tab bar ONLY if sidebar is also closed
              if (!sidebarOpen) {
                setIsTabBarVisible(true);
              }
            }}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          {/* Use ActivityIndicator for a standard loading spinner */}
          <ActivityIndicator size="large" color="#818CF8" />
          <Text className="mt-4 text-lg text-gray-600">
            Loading messages...
          </Text>
        </View>
      ) : shouldShowEmptyState ? (
        // Show EmptyState only if no messages match the *filter* (and not searching)
        <EmptyState
          onStartNewDiscussion={startNewDiscussion}
          filter={activeFilter}
        />
      ) : (
        // Message list or No Results
        <View className="flex-1">
          {showNoResults ? (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-xl font-semibold text-gray-700">
                No Results Found
              </Text>
              <Text className="text-base text-gray-500 mt-2 text-center">
                Your search for "{searchQuery}" did not match any messages in
                the current view.
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1" // Removed specific padding top
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }} // Keep padding at bottom for scrollability
              keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside TextInput
            >
              {filteredMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  onPress={() => handleMessagePress(message)} // Pass press handler
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
            opacity: overlayOpacity,
            zIndex: 999, // Ensure overlay is below sidebar
          }}
          onTouchEnd={toggleSidebar} // Close sidebar on overlay tap
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        sidebarWidth={sidebarWidth}
        sidebarTranslate={sidebarTranslate}
        activeFilter={activeFilter}
        onChangeFilter={handleChangeFilter}
        onStartNewChat={startNewDiscussion}
        allMessages={allMessages} // Pass the actual allMessages array, not an empty array
      />
    </SafeAreaView>
  );
}
