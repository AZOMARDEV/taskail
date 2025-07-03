import React from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View className="mx-4 my-8">
      <View className="flex-row items-center justify-center px-4 py-3 bg-gray-100 rounded-2xl">
        <Search size={30} color="#6B7280" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Type to search your conversation"
          placeholderTextColor="#6B7280"
          className="flex-1 ml-2 text-base text-gray-700"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default SearchBar;