import { Image, Text, TouchableOpacity, View } from "react-native";

export const SectionHeader: React.FC<{
  title: string;
  onViewAll?: () => void;
}> = ({ title, onViewAll }) => (
  <View className="justify-between flex flex-row p-3">
    <Text className="font-bold p-5 text-[22px]">{title}</Text>
    {onViewAll && (
      <TouchableOpacity activeOpacity={0.8} onPress={onViewAll}>
        <Text className="font-medium text-gray-500 p-6 text-[15px]">
          View All
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
