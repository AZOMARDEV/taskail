import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import {
  ArrowLeft,
  Paperclip,
  Smile,
  X,
  Bold,
  Italic,
  Underline,
  CheckSquare,
  List,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { WebView } from "react-native-webview";

// Attachment type
interface Attachment {
  id: number;
  name: string;
  size: string;
  type: "document" | "spreadsheet" | "video" | "image" | "other";
  uri?: string;
}

export default function NewMessagePage() {
  const params = useLocalSearchParams();
  const { email, name } = params;

  const [subject, setSubject] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  
  const webViewRef = useRef<WebView>(null);

  // Basic rich text editor HTML
  const editorHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          padding: 0;
          margin: 0;
          color: #374151;
        }
        #editor {
          min-height: 200px;
          padding: 10px;
          outline: none;
        }
      </style>
    </head>
    <body>
      <div id="editor" contenteditable="true"></div>
      <script>
        document.getElementById('editor').addEventListener('input', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'content',
            content: document.getElementById('editor').innerHTML
          }));
        });
        
        document.getElementById('editor').addEventListener('focus', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'focus'
          }));
        });
        
        // Function to execute commands
        function execCommand(command, value = null) {
          document.execCommand(command, false, value);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'content',
            content: document.getElementById('editor').innerHTML
          }));
        }
        
        // Function to insert text at cursor position
        function insertText(text) {
          document.execCommand('insertText', false, text);
        }
      </script>
    </body>
    </html>
  `;

  // Send message functionality
  const handleSendMessage = () => {
    if (!subject.trim()) {
      Alert.alert("Missing Subject", "Please enter a subject for your message");
      return;
    }

    if (!messageHtml.trim() || messageHtml === "<br>") {
      Alert.alert("Empty Message", "Please enter a message body");
      return;
    }

    // Here you would integrate with your backend to send the message
    console.log("Sending message to:", email);
    console.log("Subject:", subject);
    console.log("Message HTML:", messageHtml);
    console.log("Attachments:", attachments);

    // Navigate back to inbox after sending
    Alert.alert("Message Sent", "Your message has been sent successfully", [
      { text: "OK", onPress: () => router.push("/") },
    ]);
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event: { nativeEvent: { data: string; }; }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'content') {
        setMessageHtml(data.content);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // Apply formatting
  const applyFormatting = (command: string, value: string | null = null) => {
    webViewRef.current?.injectJavaScript(`
      execCommand('${command}', ${value ? `'${value}'` : 'null'});
      true;
    `);
  };

  // Insert emoji
  const insertEmoji = (emoji: string) => {
    webViewRef.current?.injectJavaScript(`
      insertText('${emoji}');
      true;
    `);
    setShowEmojiPicker(false);
  };

  // File handling functions
  const getFileType = (fileType: string, fileName: string): Attachment["type"] => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (fileType.includes("image") || ["jpg", "jpeg", "png", "gif", "svg"].includes(extension || "")) {
      return "image";
    } else if (fileType.includes("video") || ["mp4", "mov", "avi", "mkv"].includes(extension || "")) {
      return "video";
    } else if (["doc", "docx", "pdf", "txt"].includes(extension || "")) {
      return "document";
    } else if (["xls", "xlsx", "csv"].includes(extension || "")) {
      return "spreadsheet";
    } else {
      return "other";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

      const newAttachments = result.assets.map((asset, index) => ({
        id: Date.now() + index,
        name: asset.name || `File ${attachments.length + index + 1}`,
        size: formatFileSize(asset.size || 0),
        type: getFileType(asset.mimeType || "", asset.name || ""),
        uri: asset.uri,
      }));

      setAttachments([...attachments, ...newAttachments]);
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to add attachment");
    }
  };

  // Remove an attachment
  const removeAttachment = (id: number) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  // Get icon for attachment type
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "document":
        return "📄";
      case "spreadsheet":
        return "📊";
      case "video":
        return "🎬";
      case "image":
        return "🖼️";
      default:
        return "📎";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 ${
          Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
        }`}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-center flex-1 text-slate-800">
          New Message
        </Text>
      </View>

      {/* Message Form */}
      <ScrollView className="flex-1">
        {/* Recipient */}
        <View className="flex-row px-4 py-4 border-b border-gray-200">
          <Text className="text-lg font-semibold w-24">Send to :</Text>
          <View className="flex-1">
            <Text className="text-lg text-gray-700">{email} ;</Text>
          </View>
        </View>

        {/* Subject */}
        <View className="flex-row px-4 border-b border-gray-200">
          <Text className="text-lg py-4 font-semibold w-24">Subject :</Text>
          <TextInput
            className="flex-1 mb-4 text-lg text-gray-700"
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject"
          />
        </View>

        {/* Formatting Toolbar */}
        {showToolbar && (
          <View className="flex-row px-4 py-2 border-b border-gray-200 gap-3  justify-start space-x-2">
            <TouchableOpacity 
              className="p-2 bg-gray-100 rounded-md" 
              onPress={() => applyFormatting('bold')}
            >
              <Bold size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-2 bg-gray-100 rounded-md" 
              onPress={() => applyFormatting('italic')}
            >
              <Italic size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-2 bg-gray-100 rounded-md" 
              onPress={() => applyFormatting('underline')}
            >
              <Underline size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-2 bg-gray-100 rounded-md" 
              onPress={() => applyFormatting('insertUnorderedList')}
            >
              <List size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-2 bg-gray-100 rounded-md" 
              onPress={() => applyFormatting('insertHTML', '<div><input type="checkbox"> </div>')}
            >
              <CheckSquare size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        {/* WebView Rich Text Editor */}
        <View className="px-4 py-4" style={{ height: 400 }}>
          <WebView
            ref={webViewRef}
            source={{ html: editorHTML }}
            onMessage={handleWebViewMessage}
            originWhitelist={['*']}
            hideKeyboardAccessoryView={false}
            keyboardDisplayRequiresUserAction={false}
            containerStyle={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              height: 250,
            }}
          />
        </View>

        {/* Attachments section */}
        {attachments.length > 0 && (
          <View className="px-4 pb-2">
            <Text className="text-lg font-semibold mb-2">Attachments</Text>
          </View>
        )}

        {attachments.map((attachment) => (
          <View
            key={attachment.id}
            className="mx-4 my-2 flex-row items-center bg-gray-50 p-3 rounded-lg"
          >
            <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
              <Text className="text-2xl">
                {getAttachmentIcon(attachment.type)}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-medium">{attachment.name}</Text>
              <Text className="text-sm text-gray-500">{attachment.size}</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeAttachment(attachment.id)}
              className="p-2 bg-gray-200 rounded-full"
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Emoji Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmojiPicker}
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white p-4 border-t rounded-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Emojis</Text>
              <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[
                "😊", "👍", "🙏", "❤️", "👋", "😂", "🎉", "✅", "⭐", "🔥",
                "💯", "🤔", "👀", "💪", "🚀", "👌", "😉", "🙌", "🤝", "📝",
                "⏰", "💼", "📊", "📈", "💡", "🎯", "✨", "👏", "🔍", "📆"
              ]}
              numColumns={5}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => insertEmoji(item)}
                  className="w-1/5 p-2 items-center justify-center"
                >
                  <Text className="text-3xl">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Bottom Bar */}
      <View className="flex-row items-center p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-indigo-500 flex-1 py-3 rounded-full items-center"
          onPress={handleSendMessage}
        >
          <Text className="text-white font-semibold text-lg">Send Message</Text>
        </TouchableOpacity>

        <TouchableOpacity className="ml-3 p-2" onPress={pickDocument}>
          <Paperclip size={24} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          className="ml-3 p-2"  
          onPress={() => setShowEmojiPicker(true)}
        >
          <Smile size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}