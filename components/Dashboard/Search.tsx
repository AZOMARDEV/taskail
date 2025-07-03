// Search.tsx
import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { Search as LucideSearch } from "lucide-react-native";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
  containerClassName?: string;
  placeholder?: string;
  debounceTime?: number;
  onSearchChange?: (text: string) => void;
}

const Search: React.FC<SearchProps> = ({
  containerClassName = "",
  placeholder = "Find your ticket...", // Updated placeholder
  debounceTime = 300, // Slightly faster debounce for better UX
  onSearchChange,
}) => {
  // const path = usePathname(); // Not used in current logic
  // const params = useLocalSearchParams<{ query: string }>(); // 'search' to 'query' for consistency
  const [searchValue, setSearchValue] = useState(""); // Local search value for input
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Debounce the onSearchChange callback
  const debouncedSearchChange = useDebouncedCallback((text: string) => {
    if (onSearchChange) {
      onSearchChange(text);
    }
    // If you still want to update router params for deep linking or other purposes:
    // router.setParams({ query: text }); 
  }, debounceTime);

  const handleSearch = (text: string) => {
    setSearchValue(text);
    debouncedSearchChange(text);
  };
  
  const handlePressOutside = () => {
    Keyboard.dismiss();
    // setIsFocused(false); // Blur is handled by onBlur naturally
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View className={`mb-2 ${containerClassName}`}>
        <View
          className={`
            flex-row
            items-center
            bg-accent 
            border
            py-3
            px-4
            rounded-3xl
            ${isFocused ? "border-white" : "border-white/40"}
          `}
          style={styles.searchContainer} // Keep styles for shadow etc.
        >
          <LucideSearch
            color={isFocused ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"}
            size={24}
          />
          <TextInput
            ref={inputRef}
            value={searchValue}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.7)"
            className="flex-1 ml-3 text-base font-medium text-white"
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android
  },
  input: {
    // Basic styling to ensure text input is visible and sized correctly
    // className handles most of the styling for React Native Wind
    height: 24, // Match LucideSearch size for vertical alignment
    lineHeight: Platform.OS === 'ios' ? 0 : 24, // Fix for Android vertical alignment
    padding: 0, // Remove default padding if any
  },
});

export default Search;