// components/Dashboard/TicketSummaryCard.tsx
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import {
  Calendar,
  MoreHorizontal,
  User,
  DollarSign,
  Archive, // Generic icon for ticket
  ArrowUpCircle, // For Sell
  ArrowDownCircle, // For Buy
} from "lucide-react-native";
import { CARD_DIMENSIONS, LAYOUT_CONSTANTS } from "./constants";
import type { Ticket, CounterpartyProfile } from "./types"; // Use dashboard specific types

interface TicketSummaryCardProps extends Ticket {
  onPress?: () => void;
  onMorePress?: () => void;
}

const MetadataBadge: React.FC<{
  icon: React.ReactNode;
  value: string | number;
  label?: string;
}> = ({ icon, value, label }) => (
  <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1.5">
    {icon}
    <Text className="text-gray-600 text-[10px] ml-1.5">
      {label && <Text className="font-medium">{label}: </Text>}
      {value}
    </Text>
  </View>
);

const CounterpartyAvatar: React.FC<{ counterparty: CounterpartyProfile }> = ({
  counterparty,
}) => (
  <View className="flex-row items-center">
    {counterparty.profileImageUrl ? (
      <Image
        source={{ uri: counterparty.profileImageUrl }}
        className="w-9 h-9 rounded-full border-[0.5px] border-white"
      />
    ) : (
      <View className="w-9 h-9 bg-neutral-300 border-[0.5px] border-white rounded-full items-center justify-center">
        <User size={18} color="white" />
      </View>
    )}
  </View>
);

export const TicketSummaryCard: React.FC<TicketSummaryCardProps> = ({
  id,
  title,
  type,
  itemDescription,
  currency,
  createdAt, // This is a Date object
  counterparty,
  totalAmount, // Pre-calculated: quantity * pricePerUnit
  displayDate, // Pre-formatted date string
  onPress,
  onMorePress,
}) => {
  const ticketTypeColor = type === "sell" ? "bg-green-500" : "bg-blue-500";
  const ticketTypeIcon =
    type === "sell" ? (
      <ArrowUpCircle color="white" size={LAYOUT_CONSTANTS.iconSize.medium} />
    ) : (
      <ArrowDownCircle color="white" size={LAYOUT_CONSTANTS.iconSize.medium} />
    );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      className="bg-white rounded-xl p-4 mb-4 mx-2 shadow-sm"
      style={{
        width: CARD_DIMENSIONS.width,
        minHeight: CARD_DIMENSIONS.minHeight,
      }}
    >
      <View className="mb-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-start flex-1 mr-2">
            <View
              className={`w-10 h-10 ${ticketTypeColor} rounded-lg items-center justify-center flex-shrink-0`}
            >
              {ticketTypeIcon}
            </View>
            <View className="flex-1 ml-3">
              <Text
                className="text-gray-800 font-bold text-[15px] leading-tight"
                numberOfLines={LAYOUT_CONSTANTS.maxTitleLines}
              >
                {title}
              </Text>
              <Text className="text-xs text-gray-500 capitalize" numberOfLines={1}>
                {type} Ticket
              </Text>
            </View>
          </View>
          {onMorePress && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onMorePress}
              className="flex-shrink-0"
            >
              <View className="border-[0.5px] border-gray-300 rounded-lg p-1.5">
                <MoreHorizontal
                  color="gray"
                  size={LAYOUT_CONSTANTS.iconSize.medium}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-3">
        <MetadataBadge
          icon={<Calendar color="gray" size={LAYOUT_CONSTANTS.iconSize.small} />}
          value={displayDate || new Date(createdAt).toLocaleDateString()}
        />
        <MetadataBadge
          icon={<User color="gray" size={LAYOUT_CONSTANTS.iconSize.small} />}
          value={counterparty.name}
        />
      </View>

      <View className="mb-3 p-3 bg-gray-50 rounded-lg min-h-[60px]">
        <Text className="text-xs text-gray-700" numberOfLines={3}>
          {itemDescription}
        </Text>
      </View>
      
      <View className="flex-row items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <CounterpartyAvatar counterparty={counterparty} />
        <View className="flex-col items-end  ml-2">
           <Text className="text-gray-500 text-[11px] ">Total Amount</Text>
           <Text className="text-gray-800 font-bold text-[16px]">
            {(totalAmount ?? 0).toFixed(2)} <Text className="font-normal ">{currency}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketSummaryCard;