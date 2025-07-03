// EmptyState.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActiveFilter } from "@/app/(tabs)/inbox"; // Import type

interface EmptyStateProps {
  onStartNewDiscussion: () => void;
  filter?: ActiveFilter; // Optional filter context
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onStartNewDiscussion,
  filter,
}) => {
  let title = "You haven't any messages";
  let description = "Start a new conversation or check back later.";

  if (filter) {
    if (filter.type === "folder") {
      switch (filter.value) {
        case "starred":
          title = "No Starred Messages";
          description = "Messages you star will appear here.";
          break;
        case "sent":
          title = "No Sent Messages";
          description = "Messages you send will appear here.";
          break;
        case "draft":
          title = "No Drafts";
          description = "Saved drafts will appear here.";
          break;
        case "trash":
          title = "Trash is Empty";
          description = "Deleted messages will appear here.";
          break;
        case "inbox":
          title = "Inbox is Empty";
          description =
            "Your incoming messages will appear here. Why not start a new chat?";
          break;
      }
    } else if (filter.type === "category") {
      title = `No Messages in "${filter.value}"`;
      description = `Messages categorized as ${filter.value} will appear here.`;
    }
  }

  return (
    <View className="flex-1 items-center justify-center px-6 pt-10 pb-20">
      <Image
        source={require("../../assets/images/No-Notification.png")} // Ensure path is correct
        className="w-64 h-48 mb-6" // Adjusted size
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-center text-slate-800 mt-4">
        {title}
      </Text>
      <Text className="text-base text-center text-gray-500 mt-3 mb-10">
        {description}
      </Text>
      <TouchableOpacity
        className="px-6 py-4 bg-indigo-500 rounded-2xl w-full" // Adjusted color
        onPress={onStartNewDiscussion} // This now navigates via the prop from InboxPage
      >
        <Text className="text-white font-semibold text-center text-lg">
          {/* Adjusted weight */}
          Start New Discussion
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;
