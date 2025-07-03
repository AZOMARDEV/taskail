// MessageItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Paperclip } from "lucide-react-native";
import { format, isToday, isYesterday } from "date-fns"; // Import date-fns functions
import { Message } from "./types/Message";

interface MessageItemProps {
  message: Message;
  onPress: () => void;
}

// Helper function to format time for inbox preview
const formatInboxTime = (date: Date | undefined): string => {
  if (!date) return ""; // Handle case where date might be undefined

  if (isToday(date)) {
    return format(date, "h:mm a"); // e.g., 10:30 AM
  } else if (isYesterday(date)) {
    return "Yesterday"; // Just "Yesterday"
  } else {
    // Older than yesterday, show e.g., "Apr 15"
    return format(date, "MMM d");
  }
};
const MessageItem: React.FC<MessageItemProps> = ({ message, onPress }) => {
  const isUnread = !message.read && message.status === "inbox";

  // Define styles based on isUnread status
  const messageStyle = isUnread
    ? "bg-indigo-100 border-b border-indigo-200"
    : "bg-white border-b border-gray-200";
  const senderColor = isUnread
    ? "text-indigo-700 font-bold"
    : "text-gray-800 font-semibold";
  const projectColor = isUnread
    ? "text-indigo-600 font-semibold"
    : "text-gray-700 font-semibold";
  const contentColor = isUnread ? "text-gray-700" : "text-gray-600";
  const timeColor = isUnread ? "text-indigo-600" : "text-gray-500";
  const iconColor = isUnread ? "#6366F1" : "#4B5563"; // Hex color for Paperclip

  return (
    <TouchableOpacity
      className={`px-4 py-4 ${messageStyle} mx-4 my-1 rounded-2xl`}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-start">
        {/* Left column */}
        <View className="mr-4 pt-1">
          {/* Avatar */}
          <View className="w-12 h-12 bg-gray-200 border border-white rounded-full relative">
            <Image
              source={{ uri: `https://i.pravatar.cc/150?u=${message.sender}` }} // Use sender for unique avatar
              className="w-full h-full rounded-full"
            />
            {/* Online indicator only if not in trash/draft */}
            {message.online &&
              message.status !== "trash" &&
              message.status !== "draft" && (
                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              )}
          </View>
        </View>
        {/* Message content */}
        <View className="flex-1">
          {/* Sender and Time row */}
          <View className="flex-row justify-between items-center mb-1">
            <Text className={`${senderColor} text-base mr-2`} numberOfLines={1}>
              {message.sender}
            </Text>
            {/* **** USE FORMATTED TIMESTAMP **** */}
            <Text className={`text-xs ${timeColor}`}>
              {formatInboxTime(message.timestamp)}
            </Text>
          </View>
          {/* Project row */}
          <Text className={`${projectColor} text-sm mb-1`} numberOfLines={1}>
            {message.project}
          </Text>
          {/* Message content preview row */}
          <View className="flex-row items-center">
            {/* Conditionally render Paperclip - ensure NO space/newline after this block */}
            {message.hasAttachment && (
              <Paperclip
                size={16}
                color={iconColor}
                style={{ marginRight: 4 }}
              />
            )}
            {/* Message content Text - ensure NO space/newline before this tag */}
            <Text
              className={`${contentColor} text-sm flex-1`}
              numberOfLines={2}
            >
              {message.content}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageItem;
