// sidebar/CategoriesSection.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronUp, ChevronDown, Circle } from "lucide-react-native";
import { Category } from "../types/Message";
import { ActiveFilter } from "@/app/(tabs)/inbox"; // Import type

interface CategoriesSectionProps {
  categories: Category[];
  expanded: boolean;
  onToggleExpand: () => void;
  activeFilter: ActiveFilter;
  onChangeFilter: (filter: ActiveFilter) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  expanded,
  onToggleExpand,
  activeFilter,
  onChangeFilter,
}) => {
  const isCategoryActive = (categoryName: string) =>
    activeFilter.type === "category" && activeFilter.value === categoryName;

  return (
    <View className="mb-4">
      {/* Adjusted margin */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-6 py-3"
        onPress={onToggleExpand}
      >
        <Text className="text-sm font-semibold text-gray-500 tracking-wider">
          {/* Style Adjust */}
          CATEGORIES
        </Text>
        {expanded ? (
          <ChevronUp size={20} color="#6B7280" /> // Smaller icon
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      {expanded &&
        categories.map((category) => {
          const isActive = isCategoryActive(category.name);
          const activeBg = isActive ? "bg-indigo-100" : "";
          const activeText = isActive
            ? "text-indigo-600 font-semibold"
            : "text-gray-800 font-medium";

          return (
            <TouchableOpacity
              key={category.name} // Use name as key assuming unique
              className={`flex-row items-center px-6 py-2.5 rounded-lg mx-2 my-0.5 ${activeBg}`} // Style Adjust
              onPress={() =>
                onChangeFilter({ type: "category", value: category.name })
              }
            >
              <Circle
                size={12} // Smaller circle
                fill={category.color}
                color={category.color}
              />
              <Text className={`ml-4 text-base ${activeText}`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default CategoriesSection;
