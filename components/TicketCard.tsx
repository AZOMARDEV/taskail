// components/TicketCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // Alert removed as it's handled in parent
import { Calendar, DollarSign, User, Trash2, Barcode, Package as PackageIcon, Edit3 } from 'lucide-react-native';
import type { Ticket } from '@/context/TicketsContext'; // Use the consistent Ticket type from context

interface TicketCardProps {
  ticket: Ticket;
  onDelete: () => void; // Changed to simple function, ID is known by parent
  onPress: () => void;  // Changed to simple function, ID is known by parent
}

// Consistent date formatting function
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Unknown Date';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.warn("TicketCard: Invalid date received by formatDate:", date);
    return 'Invalid Date';
  }
  return dateObj.toLocaleDateString("en-US", { year: 'numeric', month: "short", day: "numeric" });
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDelete, onPress }) => {
  // Delete confirmation is now handled in the parent (TicketsPage)
  // const handleDeletePress = () => { ... };

  const totalPrice = ticket.quantity * ticket.pricePerUnit;
  const isSellTicket = ticket.type === 'sell';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress} // Parent handles navigation with ID
      className="bg-white rounded-lg shadow-lg mb-5 overflow-hidden flex-row border border-gray-200"
    >
      {/* Stub Section - Visually separates ticket type */}
      <View
        className={`w-20 items-center justify-between p-2 ${
          isSellTicket ? 'bg-green-600' : 'bg-blue-600' // Darker for better contrast
        } border-r border-dashed border-gray-400`} // Dotted line can be tricky; this provides a visual cue
      >
        <View className="items-center">
          <Text className="text-white font-['Outfit-Bold'] text-xs uppercase tracking-wider text-center">
            {ticket.type}
          </Text>
          <View className={`h-0.5 w-10 my-1 ${isSellTicket ? 'bg-green-400' : 'bg-blue-400'}`} />
           <Text className="text-white text-[10px] font-['Outfit-Regular'] text-center opacity-80" numberOfLines={2}>
            ID: {ticket.id.substring(ticket.id.length - 6).toUpperCase()}
          </Text>
        </View>
        <Barcode size={32} color="white" strokeWidth={1.5} className="opacity-70" />
      </View>

      {/* Main Content Section */}
      <View className="flex-1 p-3.5">
        <Text className="text-lg font-['Outfit-SemiBold'] text-gray-800 mb-1.5" numberOfLines={2}>
          {ticket.title}
        </Text>

        <View className="flex-row items-start mb-2">
          <Edit3 size={13} color="#6B7280" className="mr-2 mt-0.5 shrink-0" />
          <Text className="text-sm text-gray-600 flex-1 font-['Outfit-Regular']" numberOfLines={2}>
            {ticket.itemDescription}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-2.5">
            <View className={`flex-row items-center px-2.5 py-1 rounded-md ${isSellTicket ? 'bg-green-50' : 'bg-blue-50'}`}>
                <DollarSign size={13} color={isSellTicket ? "#059669" : "#2563EB"} className="mr-1" />
                <Text className={`text-sm font-['Outfit-Medium'] ${isSellTicket ? "text-green-700" : "text-blue-700"}`}>
                    {totalPrice.toFixed(2)} {ticket.currency}
                </Text>
            </View>
            <View className="flex-row items-center">
                <PackageIcon size={13} color="#6B7280" className="mr-1" />
                <Text className="text-xs text-gray-500 font-['Outfit-Regular']">
                    Qty: {ticket.quantity}
                    {ticket.pricePerUnit !== totalPrice && ` (@ ${ticket.pricePerUnit.toFixed(2)})`} {/* Show PPU only if different from total */}
                </Text>
            </View>
        </View>

        {/* Divider - A simple solid line is often cleaner */}
        <View className="h-px bg-gray-200 my-2" />

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1 mr-2">
            {ticket.counterparty.profileImageUrl ? (
              <Image source={{ uri: ticket.counterparty.profileImageUrl }} className="w-5 h-5 rounded-full mr-1.5" />
            ) : (
              <View className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center mr-1.5">
                 <User size={10} color="#6B7280" />
              </View>
            )}
            <Text className="text-xs text-gray-700 font-['Outfit-Medium']" numberOfLines={1}>
              {ticket.counterparty.name}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={13} color="#6B7280" className="mr-1" />
            <Text className="text-xs text-gray-500 font-['Outfit-Regular']">{formatDate(ticket.createdAt)}</Text>
          </View>
        </View>

        {/* Actions - Delete button. Edit could be added here. */}
        <View className="flex-row justify-end items-center mt-2 -mr-1 -mb-1">
            <TouchableOpacity onPress={onDelete} className="p-1.5 opacity-70 active:opacity-100">
                <Trash2 size={17} color="#EF4444" />
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketCard;