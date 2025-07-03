// ChatDetailScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Image,
  // FlatList is not used, can be removed if not needed elsewhere
  ActivityIndicator,
  StyleSheet, // Import StyleSheet for potential custom styles
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile, // Keep if you plan to add emoji picker later
  MoreVertical,
} from "lucide-react-native";
import {
  format,
  isToday,
  isYesterday,
  isSameDay as dateFnsIsSameDay, // Keep alias to avoid conflict
} from "date-fns";

// Define message structure for the chat
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentType?: string;
  read?: boolean; // Represents if the *recipient* has read the message
}

// Mock conversation data store (cleared on app reload)
const mockConversations: Record<string, ChatMessage[]> = {};

// *** UPDATE generateMockConversation ***
const generateMockConversation = (
  chatId: string,
  contactName: string,
  projectName: string | undefined,
  lastMessageContent: string,
  initialLastMessageTimestamp: Date, // Timestamp from the inbox item
  initialHasAttachment: boolean // Attachment status from inbox item
): ChatMessage[] => {
  const lastMsgTime = initialLastMessageTimestamp;

  // Generate timestamps relative to the last message (keep this logic)
  const earlierToday = new Date(lastMsgTime.getTime() - 2 * 60 * 60000);
  const yesterdayAfternoon = new Date(lastMsgTime);
  yesterdayAfternoon.setDate(lastMsgTime.getDate() - 1);
  yesterdayAfternoon.setHours(16, 30, 0, 0);
  const yesterdayMorning = new Date(
    yesterdayAfternoon.getTime() - 5 * 60 * 60000
  );

  // Define the base messages *before* the last one
  const baseMessages: ChatMessage[] = [
    {
      id: `${chatId}-1`,
      text: `Hello! Working on the ${
        projectName || "project"
      }. Let's discuss steps.`,
      sender: "contact",
      timestamp: yesterdayMorning,
      read: true,
    },
    {
      id: `${chatId}-2`,
      text: "Sure, what do you need help with?",
      sender: "user",
      timestamp: new Date(yesterdayMorning.getTime() + 30 * 60000),
      read: true,
    },
    {
      id: `${chatId}-3`,
      text: "Requirements doc ready. Sharing now.",
      sender: "contact",
      timestamp: yesterdayAfternoon,
      read: true,
    },
    {
      id: `${chatId}-4`,
      text: "Here's the doc with specs.",
      sender: "contact",
      timestamp: new Date(yesterdayAfternoon.getTime() + 2 * 60000),
      // Make attachment example consistent with text
      hasAttachment: true,
      attachmentName: "project_requirements.pdf",
      attachmentSize: "2.4 MB",
      attachmentType: "PDF",
      read: true,
    },
    {
      id: `${chatId}-5`,
      text: "Thanks! Will review soon.",
      sender: "user",
      timestamp: new Date(yesterdayAfternoon.getTime() + 15 * 60000),
      read: true,
    },
  ];

  const lastMessage: ChatMessage = {
    id: `${chatId}-last-${Date.now()}`, // More unique ID for the potentially dynamic last message
    text: lastMessageContent,
    sender: "contact", // Assuming the preview message was from the contact - adjust if needed
    timestamp: lastMsgTime,
    hasAttachment: initialHasAttachment, // Use the passed value
    // Derive attachment details only if hasAttachment is true
    attachmentName: initialHasAttachment ? "latest_document" : undefined, // Generic name or derive if possible
    attachmentSize: initialHasAttachment ? "1-3 MB" : undefined, // Placeholder size
    attachmentType: initialHasAttachment ? "File" : undefined, // Placeholder type
    read: false, // Assume the latest message from contact hasn't been read by user yet
  };

  // Combine base messages and the accurate last message
  const messages = [...baseMessages, lastMessage];

  // Sort messages chronologically (important!)
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return messages;
};


// --- Utility Functions ---

// Format time displayed below a message bubble
const formatMessageTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, "h:mm a"); // e.g., "3:45 PM"
  } else if (isYesterday(date)) {
    return "Yesterday at " + format(date, "h:mm a"); // e.g., "Yesterday at 4:30 PM"
  } else {
    return format(date, "MMM d, h:mm a"); // e.g., "Apr 15, 3:45 PM"
  }
};

// Format date for the date separator bubbles
const formatMessageDate = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "EEEE, MMMM d"); // e.g., "Friday, April 19"
  }
};

// Check if two Date objects fall on the same calendar day
const isSameDate = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Group messages by calendar date
const groupMessagesByDate = (messages: ChatMessage[]) => {
  const groups: { date: Date; messages: ChatMessage[] }[] = [];
  if (!messages || messages.length === 0) {
    return groups;
  }

  let currentGroupMessages: ChatMessage[] = [];
  let currentDate: Date | null = null;

  messages.forEach((message, index) => {
    if (!isSameDate(currentDate, message.timestamp)) {
      // If there was a previous group, push it
      if (currentGroupMessages.length > 0 && currentDate) {
        groups.push({ date: currentDate, messages: currentGroupMessages });
      }
      // Start a new group
      currentDate = message.timestamp;
      currentGroupMessages = [message];
    } else {
      // Add to the current group
      currentGroupMessages.push(message);
    }

    // If it's the last message, push the final group
    if (index === messages.length - 1 && currentDate) {
      groups.push({ date: currentDate, messages: currentGroupMessages });
    }
  });

  return groups;
};

// --- Component ---
export default function ChatDetailScreen() {
  // --- Hooks ---
  const {
    chatId,
    sender,
    project,
    content,
    isOnline: isOnlineParam,
    lastMessageTimestamp: lastMessageTimestampParam,
    // **** ADDED: Receive hasAttachment ****
    hasAttachment: hasAttachmentParam,
  } = useLocalSearchParams<{
    chatId: string;
    sender?: string;
    project?: string;
    content?: string;
    isOnline?: string;
    lastMessageTimestamp?: string;
    // **** ADDED: Define type for hasAttachment ****
    hasAttachment?: string; // Passed as 'true' or 'false' string
  }>();

  const scrollViewRef = useRef<ScrollView>(null);

  // --- State ---
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputHeight, setInputHeight] = useState(
    Platform.OS === "ios" ? 44 : 40
  ); // Initial input height
  const [showTypingIndicator, setShowTypingIndicator] = useState(false); // Controlled externally

  // --- Derived State ---
  // --- Derived State ---
  const contactIsOnline = isOnlineParam === "true"; // Logic remains the same
  const headerTitle = sender || `Chat ${chatId || "ID Missing"}`;

  // --- Effects ---
  // Load initial messages
  useEffect(() => {
    setLoading(true);
    // Provide defaults for potentially missing params (esp. from sidebar nav)
    const lastMessageContent = content || "Chat started."; // More neutral default
    const initialTimestamp = lastMessageTimestampParam
      ? new Date(lastMessageTimestampParam)
      : new Date();
    // **** ADDED: Parse hasAttachment param ****
    const initialHasAttachment = hasAttachmentParam === "true";

    if (!chatId) {
      console.error("ChatDetailScreen: Chat ID is missing!");
      setMessages([]);
      setLoading(false);
      return;
    }

    // Simulate fetching or generating conversation
    setTimeout(() => {
      // Generate only if not already existing for this session
      if (!mockConversations[chatId]) {
        mockConversations[chatId] = generateMockConversation(
          chatId,
          sender || "Contact",
          project,
          lastMessageContent, // Pass content
          initialTimestamp, // Pass date object
          initialHasAttachment // Pass boolean attachment status
        );
      }
      setMessages(mockConversations[chatId] || []);
      setLoading(false);

      // Scroll to bottom after messages are loaded
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }, 500);

  }, [chatId, sender, project, content, lastMessageTimestampParam, hasAttachmentParam]);

  // --- Event Handlers ---
  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !chatId) return;

    const now = new Date();
    const newMsg: ChatMessage = {
      id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Unique mock ID
      text: trimmedMessage,
      sender: "user",
      timestamp: now,
      read: false, // Message starts as sent (single tick), not read (double tick)
    };

    // Optimistic UI update
    setMessages((prevMessages) => [...prevMessages, newMsg]);

    // Update mock store (replace with API call)
    if (mockConversations[chatId]) {
      mockConversations[chatId].push(newMsg);
    } else {
      mockConversations[chatId] = [newMsg]; // Should exist, but handle defensively
    }

    setNewMessage("");
    setInputHeight(Platform.OS === "ios" ? 44 : 40); // Reset input height

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Send message via API/WebSocket
    // console.log("Sending message:", newMsg);
    // sendMessageAPI(chatId, newMsg);
  };

  // --- Rendering Logic ---
  const groupedMessages = groupMessagesByDate(messages);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0; // Adjust as needed

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View
        className={`
        flex-row items-center justify-between
        px-4 py-2.5 border-b border-gray-200
        ${Platform.OS === "android" ? "pt-7" : "pt-2.5"}
      `}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2" // Negative margin to expand touch target visually
        >
          <ArrowLeft size={26} color="#7980FF" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center mx-2"
          activeOpacity={0.8}
        >
          <View className="relative mr-2.5">
            <Image
              source={{
                uri: `https://i.pravatar.cc/150?u=${sender || chatId}`,
              }}
              className="w-10 h-10 rounded-full bg-gray-200" // Added fallback bg
            />
            <View
              className={`
                absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                ${contactIsOnline ? "bg-green-500" : "bg-gray-400"}
              `}
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-lg font-bold text-gray-800 text-center"
              numberOfLines={1}
            >
              {headerTitle}
            </Text>
            {project ? (
              <Text
                className="text-xs text-gray-500 text-center mt-0.5"
                numberOfLines={1}
              >
                {project}
              </Text>
            ) : (
              <Text
                className="text-xs text-gray-500 text-center mt-0.5"
                numberOfLines={1}
              >
                {contactIsOnline ? "Online" : "Offline"}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="p-2 -mr-2">
          <MoreVertical size={24} color="#7980FF" />
        </TouchableOpacity>
      </View>

      {/* Chat Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-base text-gray-500">
              Loading conversation...
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-2.5" // Horizontal padding for the whole scroll area
            contentContainerClassName="py-4" // Use specific prop for content padding
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          >
            {groupedMessages.map((group) => (
              <View key={group.date.toISOString()}>
                {/* Date Separator */}
                <View className="items-center my-4">
                  <View className="bg-gray-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-gray-500">
                      {formatMessageDate(group.date)}
                    </Text>
                  </View>
                </View>

                {/* Messages */}
                {group.messages.map((message, messageIndex) => {
                  const isUser = message.sender === "user";
                  const prevMessage = group.messages[messageIndex - 1];
                  const nextMessage = group.messages[messageIndex + 1];

                  const isFirstInBlock =
                    !prevMessage ||
                    prevMessage.sender !== message.sender ||
                    !isSameDate(prevMessage.timestamp, message.timestamp) ||
                    message.timestamp.getTime() -
                      prevMessage.timestamp.getTime() >
                      300000;
                  const isLastInBlock =
                    !nextMessage ||
                    nextMessage.sender !== message.sender ||
                    !isSameDate(nextMessage.timestamp, message.timestamp) ||
                    nextMessage.timestamp.getTime() -
                      message.timestamp.getTime() >
                      300000;
                  const showTimestamp = isLastInBlock;

                  // Dynamically build bubble classes
                  const bubbleBase = "py-2.5 px-3.5 rounded-2xl mb-px"; // Base padding/rounding
                  const bubbleBg = isUser ? "bg-indigo-600" : "bg-gray-100";
                  const bubbleMargin = isFirstInBlock ? "mt-2" : "mt-0.5";
                  // Corner rounding logic: apply specific rounding to the corners touching other bubbles from the same sender
                  let bubbleCorners = "";
                  if (isUser) {
                    bubbleCorners = isLastInBlock
                      ? "rounded-br-md"
                      : "rounded-br-md rounded-tr-md";
                    if (isFirstInBlock) bubbleCorners += " rounded-tr-2xl"; // Keep outer corner round
                  } else {
                    bubbleCorners = isLastInBlock
                      ? "rounded-bl-md"
                      : "rounded-bl-md rounded-tl-md";
                    if (isFirstInBlock) bubbleCorners += " rounded-tl-2xl"; // Keep outer corner round
                  }

                  return (
                    <View
                      key={message.id}
                      className={`mb-0.5 max-w-[80%] ${
                        isUser ? "self-end ml-auto" : "self-start mr-auto"
                      }`}
                    >
                      <View
                        className={`${bubbleBase} ${bubbleBg} ${bubbleMargin} ${bubbleCorners}`}
                      >
                        {/* Message Text */}
                        <Text
                          className={`text-base leading-snug ${
                            isUser ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {message.text}
                        </Text>

                        {/* Attachment */}
                        {message.hasAttachment && (
                          <TouchableOpacity
                            className={`flex-row items-center mt-2 p-2.5 rounded-xl ${
                              isUser ? "bg-white/15" : "bg-gray-200"
                            }`}
                            activeOpacity={0.7}
                            onPress={() =>
                              console.log(
                                "Open attachment:",
                                message.attachmentName
                              )
                            }
                          >
                            <Paperclip
                              size={16}
                              color={isUser ? "#FFFFFF" : "#4B5563"}
                            />
                            <View className="ml-2 flex-1">
                              <Text
                                className={`text-sm font-medium ${
                                  isUser ? "text-white" : "text-gray-700"
                                }`}
                                numberOfLines={1}
                              >
                                {message.attachmentName || "Attachment"}
                              </Text>
                              {message.attachmentSize && (
                                <Text
                                  className={`text-xs mt-0.5 ${
                                    isUser ? "text-white/80" : "text-gray-500"
                                  }`}
                                >
                                  {message.attachmentType} ·{" "}
                                  {message.attachmentSize}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Timestamp and Read Receipt */}
                      {showTimestamp && (
                        <Text
                          className={`text-[11px] text-gray-400 mt-1 mb-1.5 ${
                            isUser ? "text-right mr-1.5" : "text-left ml-1.5"
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                          {isUser && (
                            <Text className="ml-1 text-base text-indigo-500">
                              {message.read === true ? " ✓" : " ✓"}
                            </Text>
                          )}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}

            {/* Typing Indicator */}
            {showTypingIndicator && (
              <View className="mb-0.5 max-w-[80%] self-start mr-auto">
                <View className="py-2.5 px-3.5 rounded-2xl mb-px bg-gray-100 mt-2 rounded-bl-md">
                  <View className="flex-row items-center py-1.5">
                    {/* Basic non-animated dots */}
                    <View className="w-2 h-2 rounded-full bg-gray-400 mx-0.5 opacity-50" />
                    <View className="w-2 h-2 rounded-full bg-gray-400 mx-0.5 opacity-70" />
                    <View className="w-2 h-2 rounded-full bg-gray-400 mx-0.5 opacity-90" />
                  </View>
                </View>
                <Text className="text-[11px] text-gray-400 mt-1 mb-1.5 text-left ml-1.5 italic">
                  {sender || "Contact"} is typing...
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Message Input Area */}
        <View className="border-t border-gray-200 px-3 py-2 bg-white">
          <View
            className={`flex-row items-end bg-gray-100 rounded-full px-3 ${
              Platform.OS === "ios" ? "py-2" : "py-1"
            }`}
          >
            <TextInput
              className={`flex-1 text-base text-gray-800 leading-tight mr-2 ${
                Platform.OS === "ios" ? "py-4" : ""
              }`} // Adjusted padding for iOS
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              onContentSizeChange={(e) => {
                const contentHeight = e.nativeEvent.contentSize.height;
                const newHeight = Math.min(
                  100,
                  Math.max(Platform.OS === "ios" ? 44 : 40, contentHeight)
                );
                setInputHeight(newHeight);
              }}
              style={{ height: inputHeight }} // Dynamic height still uses inline style
            />
            <TouchableOpacity
              className={`p-2 ml-1 ${Platform.OS === "android" ? "mb-0" : ""}`}
            >
              <Paperclip size={24} color="#6B7280" />
            </TouchableOpacity>
            {/* <TouchableOpacity className={`p-2 ml-1 ${Platform.OS === 'android' ? 'mb-1' : ''}`}>
              <Smile size={24} color="#6B7280" />
            </TouchableOpacity> */}
            <TouchableOpacity
              className={`w-10 h-10 rounded-full justify-center items-center ml-2 ${
                Platform.OS === "android" ? "mb-0.5" : ""
              } ${newMessage.trim() ? "bg-indigo-500" : "bg-gray-400"}`}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              {/* Nudge send icon slightly for better visual centering */}
              <Send size={20} color="white" style={{ marginLeft: -1 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
