// components/Dashboard/TicketListItem.tsx
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { User, ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react-native"; // Assuming types are centrally managed or defined
import type { Ticket, CounterpartyProfile } from "./types";
import { LAYOUT_CONSTANTS } from "./constants";

interface TicketListItemProps extends Ticket {
  onPress?: () => void;
}

const TicketTypeIcon: React.FC<{ type: "buy" | "sell" }> = ({ type }) => {
  const bgColor = type === "sell" ? "bg-green-100" : "bg-blue-100";
  const iconColor = type === "sell" ? "#10B981" : "#3B82F6";
  const IconComponent = type === "sell" ? ArrowUpCircle : ArrowDownCircle;

  return (
    <View
      className={`w-12 h-12 ${bgColor} rounded-xl items-center justify-center`}
    >
      <IconComponent
        color={iconColor}
        size={LAYOUT_CONSTANTS.iconSize.large - 6}
      />
    </View>
  );
};

export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  title,
  type,
  currency,
  counterparty,
  totalAmount, // Pre-calculated
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-white rounded-xl py-4 px-5 mb-3 mx-4 flex-row items-center shadow-sm"
    >
      <TicketTypeIcon type={type} />

      <View className="flex-1 ml-4">
        <Text
          className="text-gray-900 font-semibold text-[13px] mb-1"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex-row items-center">
          {counterparty.profileImageUrl ? (
            <Image source={{uri: counterparty.profileImageUrl}} className="w-4 h-4 rounded-full mr-1.5" />
          ) : (
            <User size={12} color="gray" className="mr-1.5" />
          )}
          <Text className="text-gray-500 text-[11px]" numberOfLines={1}>
            {counterparty.name}
          </Text>
        </View>
      </View>

      <View className="items-end">
         <Text className="text-gray-700 font-bold text-sm">
           {(totalAmount ?? 0).toFixed(2)}
        </Text>
        <Text className="text-gray-500 text-[10px]">{currency}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TicketListItem;