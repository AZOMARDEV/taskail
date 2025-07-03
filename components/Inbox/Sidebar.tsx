// Sidebar.tsx
import React, { useState } from "react";
import { View, ScrollView, Animated, Platform } from "react-native";
import SidebarHeader from "./SidebarHeader";
import MainFolders from "./sidebar/MainFolders";
import CategoriesSection from "./sidebar/CategoriesSection";
import RecentChatsSection from "./sidebar/RecentChatsSection";
import { Category, Chat } from "./types/Message";
import { ActiveFilter } from "@/app/(tabs)/inbox"; // Import ActiveFilter type
import { router } from "expo-router";
import { Message } from "./types/Message"; // Import Message type if not already

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarWidth: number;
  sidebarTranslate: Animated.AnimatedInterpolation<string | number>;
  activeFilter: ActiveFilter;
  onChangeFilter: (filter: ActiveFilter) => void;
  onStartNewChat: () => void;
  allMessages: Message[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sidebarWidth,
  sidebarTranslate,
  activeFilter,
  onChangeFilter,
  onStartNewChat,
  allMessages,
}) => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [recentChatsExpanded, setRecentChatsExpanded] = useState(true);

  const categories: Category[] = [
    { name: "Works", count: 2, color: "#F87171" },
    { name: "Personal", count: 1, color: "#60A5FA" },
    { name: "Vacation", count: 1, color: "#34D399" },
  ];

  const recentChats: Chat[] = [
    // Assuming Alice's MessageItem is unread & she's online
    { id: 1, name: "Alice Smith", online: true, unreadCount: 1 },
    // Assuming Frank's MessageItem shows him online
    { id: 2, name: "Frank Ocean", online: true, unreadCount: 1 },
    // Keep Charlie as is unless contradicted by MessageItem
    { id: 3, name: "Charlie Brown", online: true },
  ];

  if (!isOpen) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        right: 0, // Sliding from right
        bottom: 0,
        width: sidebarWidth,
        backgroundColor: "white",
        transform: [{ translateX: sidebarTranslate }],
        zIndex: 1000,
        paddingTop: Platform.OS === "ios" ? 50 : 30, // Adjust as needed
        borderLeftWidth: 1,
        borderLeftColor: "#E5E7EB", // Add a subtle border
      }}
    >
      <SidebarHeader onClose={onClose} />
      <ScrollView className="flex-1">
        <MainFolders
          activeFilter={activeFilter}
          onChangeFilter={onChangeFilter}
        />

        <View className="h-px bg-gray-200 mx-6 my-2" />

        <CategoriesSection
          categories={categories}
          expanded={categoriesExpanded}
          onToggleExpand={() => setCategoriesExpanded(!categoriesExpanded)}
          activeFilter={activeFilter}
          onChangeFilter={onChangeFilter}
        />

        <View className="h-px bg-gray-200 mx-6 my-2" />

        <RecentChatsSection
          recentChats={recentChats}
          expanded={recentChatsExpanded}
          onToggleExpand={() => setRecentChatsExpanded(!recentChatsExpanded)}
          onStartNewChat={onStartNewChat}
          onSelectChat={(chat) => {
            // IMPORTANT CHANGE: Just call onSelectChat here to use the implementation in RecentChatsSection
            // This is now an empty handler because we'll use the handleSelectChat method inside RecentChatsSection
          }}
          allMessages={allMessages}
          onCloseSidebar={onClose}
        />
      </ScrollView>
    </Animated.View>
  );
};

export default Sidebar;