// sidebar/MainFolders.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { InboxIcon, Star, Send, FileText, Trash2 } from "lucide-react-native";
import { ActiveFilter } from "@/app/(tabs)/inbox"; // Import type

interface MainFoldersProps {
  activeFilter: ActiveFilter;
  onChangeFilter: (filter: ActiveFilter) => void;
}

const FolderItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  filterValue: "inbox" | "starred" | "sent" | "draft" | "trash";
  isActive: boolean;
  onPress: () => void;
  notificationCount?: number | string;
}> = ({ label, icon, isActive, onPress, notificationCount }) => {
  const activeBg = isActive ? "bg-indigo-100" : "";
  const activeText = isActive
    ? "text-indigo-600 font-semibold"
    : "text-gray-800 font-medium";
  const activeIconColor = isActive ? "#818CF8" : "#374151";

  // Update icon color based on active state
  const coloredIcon = React.cloneElement(icon as React.ReactElement, {
    color: activeIconColor,
  });

  return (
    <TouchableOpacity
      className={`flex-row items-center px-6 py-3 rounded-lg mx-2 my-0.5 ${activeBg}`} // Add rounding and margin
      onPress={onPress}
    >
      <View className="w-8 h-8 justify-center items-center">{coloredIcon}</View>
      <Text className={`ml-4 text-base ${activeText}`}>
        {/* Adjusted text size */}
        {label}
      </Text>
      {notificationCount && (
        <View className="ml-auto bg-red-400 rounded-full px-2 py-0.5">
          <Text className="text-white text-xs font-medium">
            {notificationCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const MainFolders: React.FC<MainFoldersProps> = ({
  activeFilter,
  onChangeFilter,
}) => {
  const isFolderActive = (
    folder: "inbox" | "starred" | "sent" | "draft" | "trash"
  ) => activeFilter.type === "folder" && activeFilter.value === folder;

  // Replace onShowInbox with direct calls to onChangeFilter
  return (
    <View className="mb-4 mt-2">
      <FolderItem
        label="Inbox"
        icon={<InboxIcon size={22} />}
        filterValue="inbox"
        isActive={isFolderActive("inbox")}
        onPress={() => onChangeFilter({ type: "folder", value: "inbox" })}
        notificationCount="2" // Example count, calculate dynamically later
      />
      <FolderItem
        label="Starred"
        icon={<Star size={22} />}
        filterValue="starred"
        isActive={isFolderActive("starred")}
        onPress={() => onChangeFilter({ type: "folder", value: "starred" })}
      />
      <FolderItem
        label="Sent"
        icon={<Send size={22} />}
        filterValue="sent"
        isActive={isFolderActive("sent")}
        onPress={() => onChangeFilter({ type: "folder", value: "sent" })}
      />
      <FolderItem
        label="Draft"
        icon={<FileText size={22} />}
        filterValue="draft"
        isActive={isFolderActive("draft")}
        onPress={() => onChangeFilter({ type: "folder", value: "draft" })}
      />
      <FolderItem
        label="Trash"
        icon={<Trash2 size={22} />}
        filterValue="trash"
        isActive={isFolderActive("trash")}
        onPress={() => onChangeFilter({ type: "folder", value: "trash" })}
      />
    </View>
  );
};

export default MainFolders;
