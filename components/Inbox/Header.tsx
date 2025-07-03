import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ArrowLeft, Menu } from "lucide-react-native";
import { router } from "expo-router";

interface HeaderProps {
  onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View
      className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 ${
        Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
      }`}
    >
      <TouchableOpacity onPress={() => router.back()} className="p-2">
        <ArrowLeft size={28} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-center flex-1 text-slate-800">
        Inbox
      </Text>
      <TouchableOpacity className="p-2" onPress={onMenuPress}>
        <Menu size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;