// sidebar/RecentChatsSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ChevronUp, ChevronDown, Plus } from "lucide-react-native";
import { Chat, Message } from "../types/Message"; // Import Message
import { router } from "expo-router"; // Need router here now

interface RecentChatsSectionProps {
  recentChats: Chat[];
  expanded: boolean;
  onToggleExpand: () => void;
  onStartNewChat: () => void;
  allMessages: Message[];
  onCloseSidebar: () => void;
  onSelectChat: (chat: Chat) => void; // Added onSelectChat prop
}

const RecentChatsSection: React.FC<RecentChatsSectionProps> = ({
  recentChats,
  expanded,
  onToggleExpand,
  onStartNewChat,
  allMessages,
  onCloseSidebar,
  onSelectChat,
}) => {
  const handleSelectChat = (chat: Chat) => {
    // Check if we actually have messages to work with
    if (allMessages && allMessages.length > 0) {
      // Filter messages for this chat sender
      const relevantMessages = allMessages
        .filter((msg) => msg.sender === chat.name)
        .sort((a, b) => {
          // Safely handle timestamps (they might be undefined)
          const timeA = a.timestamp ? a.timestamp.getTime() : 0;
          const timeB = b.timestamp ? b.timestamp.getTime() : 0;
          return timeB - timeA; // Sort descending by time
        });
      
      const latestMessage = relevantMessages.length > 0 ? relevantMessages[0] : null;
      
      // Create navigation params using found message or fallbacks
      const params = {
        chatId: chat.id.toString(),
        sender: chat.name,
        isOnline: chat.online ? "true" : "false",
        // Use details from latest message if found, otherwise use fallbacks
        project: latestMessage?.project || "Project Unknown",
        content: latestMessage?.content || "No messages found",
        lastMessageTimestamp:
          (latestMessage?.timestamp ? latestMessage.timestamp.toISOString() : new Date().toISOString()),
        hasAttachment: latestMessage?.hasAttachment ? "true" : "false",
      };
  
      // Close sidebar and navigate
      onCloseSidebar();
      router.push({
        pathname: `/chat/[chatId]`,
        params: params,
      });
    } else {
      // Handle case where no messages exist yet
      console.log("No messages available to navigate with");
      // Still navigate but with minimal information
      onCloseSidebar();
      router.push({
        pathname: `/chat/[chatId]`,
        params: {
          chatId: chat.id.toString(),
          sender: chat.name,
          project: "No messages yet",
          content: "Start a new conversation",
          isOnline: chat.online ? "true" : "false",
          lastMessageTimestamp: new Date().toISOString(),
          hasAttachment: "false",
        },
      });
    }
  };

  return (
    <View className="mb-6">
      <TouchableOpacity
        className="flex-row items-center justify-between px-6 py-3"
        onPress={onToggleExpand}
      >
        <Text className="text-sm font-semibold text-gray-500 tracking-wider">
          RECENT CHATS
        </Text>
        {expanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      {expanded && (
        <>
          {/* Start New Chat Button */}
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-lg mx-2 my-0.5"
            onPress={onStartNewChat}
          >
            <View className="w-8 h-8 bg-indigo-400 rounded-full justify-center items-center">
              <Plus size={20} color="white" />
            </View>
            <Text className="ml-4 text-base font-medium text-indigo-500">
              Start New Chat
            </Text>
          </TouchableOpacity>

          {/* List Recent Chats */}
          {recentChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              className="flex-row items-center px-6 py-2.5 rounded-lg mx-2 my-0.5"
              onPress={() => handleSelectChat(chat)} // Use the handleSelectChat function here
            >
              <View className="w-8 h-8 bg-gray-200 rounded-full relative">
                <Image
                  source={{ uri: `https://i.pravatar.cc/150?u=${chat.name}` }}
                  className="w-full h-full rounded-full"
                />
                {chat.online && (
                  <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                )}
              </View>
              <Text
                className="ml-4 text-base font-medium text-gray-800 flex-1"
                numberOfLines={1}
              >
                {chat.name}
              </Text>
              {chat.unreadCount && chat.unreadCount > 0 && (
                <View className="ml-2 bg-red-400 rounded-full px-2 py-0.5">
                  <Text className="text-white text-xs font-medium">
                    {chat.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

export default RecentChatsSection;