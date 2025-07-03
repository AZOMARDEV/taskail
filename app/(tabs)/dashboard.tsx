// DashboardWithCurvedBackground.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { auth } from "../../configs/FireBaseConfig"; // Ensure correct path
import Search from "@/components/Dashboard/Search"; // Ensure correct path
import type { Ticket as ContextTicket, CounterpartyProfile } from "@/context/TicketsContext"; // Use types from context
import { SectionHeader } from "@/components/Dashboard/SectionHeader"; // Ensure correct path
import { TicketSummaryCard } from "@/components/Dashboard/TicketSummaryCard"; // Ensure correct path
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader"; // Ensure correct path
import Svg, { Ellipse } from "react-native-svg";
import { TicketListItem } from "@/components/Dashboard/TicketListItem"; // Ensure correct path
import { router } from "expo-router";
import { useTickets } from "@/context/TicketsContext";

// Helper to format date (ensure this is robust or use a library like date-fns)
const formatDateForDisplay = (date: Date | string | undefined): string => {
  if (!date) return "Date Unknown";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.warn("Invalid date received by formatDateForDisplay:", date);
    return "Invalid Date";
  }
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Interface for tickets displayed on the dashboard, extending the context's Ticket type
interface DashboardDisplayTicket extends ContextTicket {
  displayDate: string;
  totalAmount: number;
}

const DashboardWithCurvedBackground = () => {
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const { tickets: contextTickets, loading: ticketsLoading } = useTickets();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    } else if (currentUser?.email) {
      setUserName(currentUser.email.split('@')[0]);
    }
    // No local ticket fetching/mocking needed here anymore
  }, []);

  const processedTicketsForDashboard: DashboardDisplayTicket[] = useMemo(() => {
    if (!contextTickets) return [];
    return contextTickets.map(ticket => ({
      ...ticket,
      totalAmount: ticket.quantity * ticket.pricePerUnit,
      displayDate: formatDateForDisplay(ticket.createdAt),
    }));
  }, [contextTickets]);


  const handleNotificationPress = () => {
    router.push("/(screen)/notification"); // Adjust path if needed
  };

  const handleViewAll = () => {
    router.push("/(tabs)/create"); // Navigate to the Ticket List/Creation page
  };

  const handleTicketPress = (ticketId: string) => {
    const ticketToNavigate = contextTickets.find(t => t.id === ticketId);
    if (ticketToNavigate) {
      router.push({
        pathname: `/ticket/[id]`,
        params: { // Pass all necessary parameters as strings
          id: ticketToNavigate.id,
          title: ticketToNavigate.title,
          type: ticketToNavigate.type,
          itemDescription: ticketToNavigate.itemDescription,
          quantity: String(ticketToNavigate.quantity),
          pricePerUnit: String(ticketToNavigate.pricePerUnit),
          currency: ticketToNavigate.currency,
          counterpartyId: ticketToNavigate.counterparty.id,
          counterpartyName: ticketToNavigate.counterparty.name,
          counterpartyProfileImageUrl: ticketToNavigate.counterparty.profileImageUrl || '',
          notes: ticketToNavigate.notes ?? '',
          createdAt: ticketToNavigate.createdAt.toISOString(), // Pass as ISO string
        },
      });
    } else {
      console.warn("Dashboard: Ticket not found for navigation:", ticketId);
    }
  };

  const handleTicketMorePress = (ticketId: string) => {
    console.log("Dashboard: Ticket more options pressed for ticket ID -", ticketId);
    // Implement actions like edit, delete, share, etc. via a modal or action sheet
  };

  const filteredTicketsForDisplay = useMemo(() => {
    if (ticketsLoading) return []; // Don't filter while loading
    if (!searchQuery) {
      return processedTicketsForDashboard;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return processedTicketsForDashboard.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(lowerCaseQuery) ||
        ticket.itemDescription.toLowerCase().includes(lowerCaseQuery) ||
        ticket.counterparty.name.toLowerCase().includes(lowerCaseQuery) ||
        ticket.currency.toLowerCase().includes(lowerCaseQuery) ||
        ticket.type.toLowerCase().includes(lowerCaseQuery)
    );
  }, [processedTicketsForDashboard, searchQuery, ticketsLoading]);

  // Tickets for the "Recent Tickets" summary (horizontal scroll)
  const recentTicketsForSummary = useMemo(() => {
    // Ensure they are sorted by date from processed (which are already sorted by context)
    return filteredTicketsForDisplay.slice(0, 5);
  }, [filteredTicketsForDisplay]);

  // Tickets for the main list section (vertical scroll)
  const listedTickets = useMemo(() => {
    // Can show all filtered tickets, or apply further slicing/pagination
    return filteredTicketsForDisplay.slice(0, 10); // Example: show up to 10
  }, [filteredTicketsForDisplay]);

  if (ticketsLoading && !processedTicketsForDashboard.length) { // Show full screen loader if no tickets loaded yet
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-3 text-gray-600">Loading Dashboard Data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      <ScrollView
        className="bg-transparent"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-accent relative overflow-hidden">
          {/* Background circles */}
          <View className="absolute top-0 left-0 right-0 bottom-0 ">
            <Svg height="100%" width="100%" className="absolute ">
              <Ellipse cx="120%" cy="-10%" rx="40%" ry="30%" fill="rgba(255,255,255,0.05)" />
              <Ellipse cx="80%" cy="-10%" rx="60%" ry="45%" fill="rgba(255,255,255,0.05)" />
              <Ellipse cx="130%" cy="-10%" rx="65%" ry="40%" fill="rgba(255,255,255,0.03)" />
              <Ellipse cx="100%" cy="-10%" rx="55%" ry="40%" fill="rgba(255,255,255,0.05)" />
            </Svg>
          </View>

          <View className="w-full px-6 justify-center z-10 mb-9 ">
            <DashboardHeader
              userName={userName}
              onNotificationPress={handleNotificationPress}
            />
            <Search
              placeholder="Find your ticket..."
              onSearchChange={setSearchQuery}
            />
          </View>

          <View className="rounded-t-3xl pb-5 bg-gray-100 w-full min-h-[70vh]">
            <SectionHeader
              title="Recent Tickets"
              onViewAll={handleViewAll} // "View All" always points to the main ticket list
            />
            {ticketsLoading && !recentTicketsForSummary.length ? (
              <View className="h-[100px] items-center justify-center">
                <ActivityIndicator color="#4F46E5" />
              </View>
            ) : recentTicketsForSummary.length > 0 ? (
              <View className="bg-transparent h-[330px] w-full"> 
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
                >
                  {recentTicketsForSummary.map((ticket) => (
                    <TicketSummaryCard
                      key={ticket.id}
                      {...ticket}
                      onPress={() => handleTicketPress(ticket.id)}
                      onMorePress={() => handleTicketMorePress(ticket.id)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
                 <View className="h-[100px] items-center justify-center px-4">
                    <Text className="text-gray-500 text-center">
                      {contextTickets.length === 0 ? "No tickets yet. Add one from the 'Tickets' tab!" : "No recent tickets."}
                    </Text>
                 </View>
            )}

            <View className="bg-transparent w-full mt-2">
              <SectionHeader
                title={searchQuery ? "Search Results" : (contextTickets.length > 0 ? "More Tickets" : "")}
                // Only show "View All" for this section if not searching and there are more tickets than shown
                onViewAll={!searchQuery && contextTickets.length > listedTickets.length ? handleViewAll : undefined}
              />
              {ticketsLoading && !listedTickets.length && contextTickets.length > 0 ? (
                 <View className="h-[100px] items-center justify-center">
                   <ActivityIndicator color="#4F46E5" />
                 </View>
              ) : listedTickets.length > 0 ? (
                <View className="mt-2 px-1">
                  {listedTickets.map((ticket) => (
                    <TicketListItem
                      key={ticket.id}
                      {...ticket}
                      onPress={() => handleTicketPress(ticket.id)}
                    />
                  ))}
                </View>
              ) : (
                  <View className="h-[100px] items-center justify-center px-4">
                    {contextTickets.length > 0 && searchQuery && (
                       <Text className="text-gray-500 text-center">No tickets match your search.</Text>
                    )}
                  </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardWithCurvedBackground;