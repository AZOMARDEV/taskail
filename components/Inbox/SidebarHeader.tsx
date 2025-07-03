import React from "react";
import { View, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  return (
    <View className="flex-row justify-start px-4 pb-4">
      <TouchableOpacity onPress={onClose} className="p-2">
        <X size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default SidebarHeader;