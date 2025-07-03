import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../../configs/FireBaseConfig";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Diamond,
  HelpCircle,
  Star,
  Eye,
  LogOut,
  Settings,
  Search,
  ArrowLeft,
} from "lucide-react-native";
import { Pressable } from "react-native";

interface LogoutConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View className="flex-1 justify-center items-center bg-black/30">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl w-[80%] max-w-[400px] items-center shadow-xl">
              <Text className="text-2xl px-10 py-7 font-semibold text-center">
                Are you sure, you want to log out?
              </Text>

              <Pressable
                onPress={onConfirm}
                // style={({ pressed }) => [
                //   { backgroundColor: pressed ? "#ffeeee" : "transparent" },
                // ]}
                className="w-full"
              >
                {({ pressed }) => (
                  <Text
                    className={`text-center border-t py-5 border-gray-300 text-red-500 font-semibold text-base ${
                      pressed ? "bg-red-100" : ""
                    }`}
                  >
                    Logout
                  </Text>
                )}
              </Pressable>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full"
                onPress={onCancel}
              >
                <Text className="text-gray-600 border-t py-5 border-gray-300 text-center font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function Profile() {
  const [user, setUser] = useState(auth.currentUser);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        setShowLogoutModal(false);
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const navigateToDashboard = () => {
    router.replace("/dashboard");
  };

  if (!user) {
    return <Redirect href="/auth/sign-in" />;
  }

  const menuItems = [
    {
      icon: <Diamond size={24} color="#4B5563" />,
      title: "Upgrade to Premium",
      action: () => router.push("/profile/premium"),
    },
    {
      icon: <HelpCircle size={24} color="#4B5563" />,
      title: "Help Center",
      action: () => router.push("/profile/help-center"),
    },
    {
      icon: <Star size={24} color="#4B5563" />,
      title: "Rate the App",
      action: () => router.push("/profile/rate-app"),
    },
    {
      icon: <Eye size={24} color="#4B5563" />,
      title: "Privacy Policy",
      action: () => router.push("/profile/privacy-policy"),
    },
    {
      icon: <LogOut size={24} color="#FF4B55" />,
      title: "Log out",
      action: () => setShowLogoutModal(true),
      textColor: "#FF4B55",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "white",
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-300 ${
            Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
          }`}
        >
          <TouchableOpacity onPress={navigateToDashboard} className="p-2">
            <ArrowLeft size={30} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-center flex-1">Profile</Text>

          <View className="flex-row items-center justify-between gap-1">
            <TouchableOpacity onPress={() => console.log("Settings pressed")}>
              <Settings size={22} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Search pressed")}>
              <Search size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View className="items-center mt-6">
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
          <Text className="text-xl font-semibold mb-2">
            {user.displayName || "Rafi Islam Apon"}
          </Text>
          <Text className="text-gray-500 mb-4">
            {user.email || "rafiislamapon2001@workmail.com"}
          </Text>
          <TouchableOpacity
            className="bg-accent w-[80%] py-4 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="p-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              onPress={item.action}
              className="flex-row items-center px-2 py-4 border-b border-gray-100"
            >
              <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
                {item.icon}
              </View>
              <Text
                className={`flex-1 ml-4 text-base ${
                  item.textColor ? `text-[${item.textColor}]` : "text-gray-700"
                }`}
              >
                {item.title}
              </Text>
              {item.title !== "Log out" && (
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <LogoutConfirmationModal
        visible={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
}
