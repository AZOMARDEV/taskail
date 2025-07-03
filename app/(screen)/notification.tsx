// app/(screen)/notification.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Filter,
  MoreVertical,
  ChevronDown,
  Search,
  CheckCircle,
  Circle,
  X,
  Ticket as TicketIconLucide,
  MessageSquare,
  UserPlus,
  RefreshCw,
} from "lucide-react-native";
import { router } from "expo-router";
// Import CounterpartyProfile and the MOCK_CONTEXT_COUNTERPARTIES directly for use
import type { CounterpartyProfile } from "@/context/TicketsContext";
import { MOCK_CONTEXT_COUNTERPARTIES } from '@/context/TicketsContext';


// --- Type Definitions ---
type NotificationActionType = "comment" | "assignment" | "update" | "mention" | "new_ticket";

interface AppNotification {
  id: string;
  actor: CounterpartyProfile; // Now directly uses CounterpartyProfile
  actionType: NotificationActionType;
  ticket?: {
    id: string; title: string; type: "buy" | "sell"; itemDescription: string;
    quantity: number; pricePerUnit: number; currency: string;
    counterparty: CounterpartyProfile;
    notes?: string; createdAt: string;
  };
  message?: string;
  timestamp: Date;
  isRead: boolean;
}

// --- Mock Data with Corrected Actor Population ---
const MOCK_NOTIFICATIONS_DATA: AppNotification[] = [
  {
    id: "notif_1",
    // Ensure find() correctly assigns the full CounterpartyProfile object
    actor: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_rafiap')!,
    actionType: "mention",
    ticket: {
      id: "TKT001", title: "NFT Website and Mobile App Design",
      type: "sell", itemDescription: "Full design services for NFT platform...",
      quantity: 1, pricePerUnit: 1250, currency: "USD",
      counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_clienta')!,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: "Initial design phase discussion..."
    },
    message: "mentioned you: \"@Current User (You) check the latest mockups?\"",
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    isRead: false,
  },
  {
    id: "notif_2",
    actor: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_user_current')!,
    actionType: "assignment",
    ticket: {
      id: "TKT002", title: "Redesign Dashboard Finance",
      type: "buy", itemDescription: "Purchase and integration of a premium finance dashboard...",
      quantity: 1, pricePerUnit: 199, currency: "USD",
      counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_vendorb')!,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    message: `assigned ${MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_zaray')?.name || 'Zara Yasmin Tasnim'} to this ticket.`,
    timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
    isRead: false,
  },
  {
    id: "notif_3",
    actor: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_davidm')!,
    actionType: "comment",
    ticket: {
      id: "TKT003", title: "Real Estate Website Design Project",
      type: "sell", itemDescription: "Development of a responsive real estate portal...",
      quantity: 1, pricePerUnit: 3500, currency: "EUR",
      counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_clientc')!,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    message: "commented: 'Looks good, please proceed with the development phase.'",
    timestamp: new Date(new Date(Date.now() - 86400000 * 1).setHours(14,0,0)),
    isRead: true,
  },
  {
    id: "notif_4",
    actor: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_ikramt')!,
    actionType: "update",
    ticket: {
        id: "TKT004", title: "Architecture Web Design Project",
        type: "sell", itemDescription: "Showcase portfolio for an architecture firm...",
        quantity: 1, pricePerUnit: 1800, currency: "GBP",
        counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_archfirmd')!,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    message: "updated the status to 'In Review'.",
    timestamp: new Date(new Date(Date.now() - 86400000 * 1).setHours(13, 0, 0)),
    isRead: true,
  },
  {
    id: "notif_5",
    actor: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_mehedih')!,
    actionType: "new_ticket",
    ticket: {
        id: "TKT005", title: "Marketing Campaign for Q3 Launch",
        type: "buy", itemDescription: "Digital marketing services for new product launch...",
        quantity: 1, pricePerUnit: 2200, currency: "USD",
        counterparty: MOCK_CONTEXT_COUNTERPARTIES.find(c => c.id === 'cp_ctx_agencye')!,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    message: "created a new high-priority ticket relevant to your team.",
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    isRead: true,
  },
];


// --- Helper Functions ---
const formatNotificationTime = (timestamp: Date): string => {
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - timestamp.getTime()) / 1000);
    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return `Yesterday`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// --- Main Component ---
export default function NotificationPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState<"All" | "Unread">("All");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedActionTypes, setSelectedActionTypes] = useState<Set<NotificationActionType>>(new Set());
  const [selectedActorNames, setSelectedActorNames] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setNotifications(MOCK_NOTIFICATIONS_DATA.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
    setIsLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/dashboard");
  };

  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleSearchBlur = () => { if (!searchQuery) setIsSearchFocused(false); };
  const handleClearSearch = () => { setSearchQuery(""); Keyboard.dismiss(); setIsSearchFocused(false); };

  const allPossibleActionTypes = useMemo(() => ["comment", "assignment", "update", "mention", "new_ticket"] as NotificationActionType[], []);
  // Use the actual actor names from the (potentially filtered) MOCK_NOTIFICATIONS_DATA for dynamic filter options
  const allPossibleActorNames = useMemo(() => [...new Set(MOCK_NOTIFICATIONS_DATA.map(n => n.actor.name))].sort(), []);


  const toggleFilter = (filters: Set<any>, setter: React.Dispatch<React.SetStateAction<Set<any>>>, item: any) => {
    const newFilters = new Set(filters);
    if (newFilters.has(item)) newFilters.delete(item); else newFilters.add(item);
    setter(newFilters);
  };
  const clearAllModalFilters = () => { setSelectedActionTypes(new Set()); setSelectedActorNames(new Set()); };

  const filteredNotifications = useMemo(() => {
    let result = [...notifications]; // Start with a copy of all notifications
    if (activeFilterTab === "Unread") result = result.filter(n => !n.isRead);
    if (searchQuery) {
      const lq = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.actor.name.toLowerCase().includes(lq) || 
        (n.ticket?.title && n.ticket.title.toLowerCase().includes(lq)) || 
        (n.message && n.message.toLowerCase().includes(lq))
      );
    }
    if (selectedActionTypes.size > 0) result = result.filter(n => selectedActionTypes.has(n.actionType));
    if (selectedActorNames.size > 0) result = result.filter(n => selectedActorNames.has(n.actor.name));
    return result;
  }, [notifications, activeFilterTab, searchQuery, selectedActionTypes, selectedActorNames]);

  const unreadCountGlobal = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);
  const appliedModalFiltersCount = selectedActionTypes.size + selectedActorNames.size;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center"><StatusBar barStyle="dark-content" /><ActivityIndicator size="large" color="#4F46E5" /><Text className="mt-3 text-gray-600">Loading Notifications...</Text></SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white ${Platform.OS === "ios" ? "pt-3" : "pt-10"}`}>
        <TouchableOpacity onPress={handleBackPress} className="p-2 -ml-2"><ArrowLeft size={26} color="#374151" /></TouchableOpacity>
        <Text className="text-xl font-bold text-center flex-1 text-gray-800">Notifications</Text>
        <View className="w-9 h-9" />
      </View>
      <View className="px-4 pt-4 pb-2">
        <View className={`flex-row items-center bg-gray-100 rounded-xl border ${isSearchFocused ? 'border-accent' : 'border-transparent'}`}>
          <View className="pl-3 pr-2"><Search size={20} color={isSearchFocused ? "#4F46E5" : "#6B7280"} /></View>
          <TextInput ref={searchInputRef} placeholder="Search notifications..." placeholderTextColor="#9CA3AF" className="flex-1 h-12 text-base text-gray-800" value={searchQuery} onChangeText={setSearchQuery} onFocus={handleSearchFocus} onBlur={handleSearchBlur} returnKeyType="search" clearButtonMode="while-editing" />
          {searchQuery.length > 0 && Platform.OS === 'android' && (<TouchableOpacity onPress={handleClearSearch} className="p-3"><X size={18} color="#6B7280" /></TouchableOpacity>)}
        </View>
      </View>
      <View className="flex-row justify-between items-center px-4 py-3 mb-2">
        <View className="flex-row space-x-2">
          {(["All", "Unread"] as const).map(tab => (<TouchableOpacity key={tab} onPress={() => setActiveFilterTab(tab)} className={`px-4 py-2 rounded-full ${activeFilterTab === tab ? "bg-accent" : "bg-gray-100"}`}><Text className={`font-medium text-sm ${activeFilterTab === tab ? "text-white" : "text-gray-700"}`}>{tab} {tab === "Unread" && unreadCountGlobal > 0 && `(${unreadCountGlobal})`}</Text></TouchableOpacity>))}
        </View>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} className={`flex-row items-center px-3 py-2 rounded-full ${appliedModalFiltersCount > 0 ? "bg-indigo-100 border border-indigo-300" : "bg-gray-100"}`}><Filter size={16} color={appliedModalFiltersCount > 0 ? "#4F46E5" : "#4B5569"} /><Text className={`ml-1.5 font-medium text-sm ${appliedModalFiltersCount > 0 ? "text-indigo-700" : "text-gray-700"}`}>Filters {appliedModalFiltersCount > 0 && `(${appliedModalFiltersCount})`}</Text></TouchableOpacity>
      </View>
      {filteredNotifications.length > 0 ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 70 }} keyboardShouldPersistTaps="handled" onScrollBeginDrag={Keyboard.dismiss}>
          {filteredNotifications.map((notification) => (<NotificationItem key={notification.id} notification={notification} />))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-6 pb-10 text-center">
          <Image source={require("../../assets/images/No-Notification.png")} className="w-60 h-48 opacity-80" resizeMode="contain" />
          <Text className="text-xl font-bold text-slate-800 mt-6">{searchQuery || appliedModalFiltersCount > 0 || (activeFilterTab === "Unread" && unreadCountGlobal === 0 && notifications.length > 0) ? "No Matching Notifications" : "No Notifications Yet"}</Text>
          <Text className="text-base text-gray-500 mt-2  leading-relaxed">{searchQuery || appliedModalFiltersCount > 0 || (activeFilterTab === "Unread" && unreadCountGlobal === 0 && notifications.length > 0) ? "Try adjusting your search or filter criteria." : "When there's activity on your tickets or tasks, you'll see it here."}</Text>
          {(searchQuery || appliedModalFiltersCount > 0) && (<TouchableOpacity className="mt-6 bg-accent px-6 py-3 rounded-full" onPress={() => { setSearchQuery(""); clearAllModalFilters(); setActiveFilterTab("All"); }}><Text className="text-white font-semibold text-sm">Clear Search & Filters</Text></TouchableOpacity>)}
        </View>
      )}
      <Modal animationType="slide" transparent={true} visible={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}><View className="flex-1 justify-end bg-black/40"><TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}><View className="bg-white rounded-t-2xl max-h-[75vh]">
          <View className="p-5 border-b border-gray-200 flex-row justify-between items-center"><Text className="text-lg font-bold text-slate-800">Filter Notifications</Text><TouchableOpacity onPress={() => setFilterModalVisible(false)} className="p-1"><X size={22} color="#4B5563" /></TouchableOpacity></View>
          <ScrollView className="p-5" keyboardShouldPersistTaps="handled">
            <View className="mb-5"><Text className="text-base font-bold mb-2 text-slate-700">Action Type</Text>
              {allPossibleActionTypes.map((action) => (<TouchableOpacity key={action} className="flex-row items-center py-2.5" onPress={() => toggleFilter(selectedActionTypes, setSelectedActionTypes, action)}>{selectedActionTypes.has(action) ? <CheckCircle size={22} color="#4F46E5" /> : <Circle size={22} color="#CBD5E1" />}<Text className="text-sm text-gray-700 ml-3 capitalize">{action.replace(/_/g, " ")}</Text></TouchableOpacity>))}
            </View>
            <View className="mb-5"><Text className="text-base font-semibold mb-2 text-slate-700">From User</Text>
              {allPossibleActorNames.map((name) => (<TouchableOpacity key={name} className="flex-row items-center py-2.5" onPress={() => toggleFilter(selectedActorNames, setSelectedActorNames, name)}>{selectedActorNames.has(name) ? <CheckCircle size={22} color="#4F46E5" /> : <Circle size={22} color="#CBD5E1" />}<Text className="text-sm text-gray-700 ml-3">{name}</Text></TouchableOpacity>))}
            </View>
          </ScrollView>
          <View className="p-4 border-t border-gray-200 flex-row space-x-3">
            <TouchableOpacity className="flex-1 py-3.5 bg-gray-100 rounded-xl items-center" onPress={() => { clearAllModalFilters(); setFilterModalVisible(false);}}><Text className="font-['Outfit-Medium'] text-gray-700 text-sm">Clear & Apply</Text></TouchableOpacity>
            <TouchableOpacity className="flex-1 py-3.5 bg-accent rounded-xl items-center" onPress={() => setFilterModalVisible(false)}><Text className="font-semibold text-white text-sm">Done</Text></TouchableOpacity>
          </View>
        </View></TouchableWithoutFeedback></View></TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// --- Notification Item Component ---
interface NotificationItemProps {
  notification: AppNotification;
}
const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { actor, actionType, ticket, message, timestamp, isRead, id } = notification;
  const [isNotificationReadLocally, setIsNotificationReadLocally] = useState(isRead);

  const handlePressNotification = () => {
    if (!isNotificationReadLocally) {
      setIsNotificationReadLocally(true);
      console.log(`Notification ${id} marked as read (locally).`);
      // TODO: API call to mark as read on backend
    }

    if (ticket && ticket.id && ticket.title && ticket.type && ticket.itemDescription != null && ticket.quantity != null && ticket.pricePerUnit != null && ticket.currency && ticket.counterparty && ticket.createdAt) {
      router.push({
        pathname: `/ticket/[id]`,
        params: {
          id: ticket.id,
          title: ticket.title,
          type: ticket.type,
          itemDescription: ticket.itemDescription,
          quantity: String(ticket.quantity),
          pricePerUnit: String(ticket.pricePerUnit),
          currency: ticket.currency,
          counterpartyId: ticket.counterparty.id,
          counterpartyName: ticket.counterparty.name,
          counterpartyProfileImageUrl: ticket.counterparty.profileImageUrl || '',
          notes: ticket.notes ?? '',
          createdAt: ticket.createdAt, // Already an ISO string
        },
      });
    } else {
      console.warn("Notification pressed, but insufficient/missing ticket data for navigation:", id, ticket);
    }
  };

  const getIconForAction = (action: NotificationActionType) => {
    const iconProps = { size: 18, strokeWidth: 1.5 };
    switch (action) {
      case "comment": return <MessageSquare {...iconProps} className="text-blue-600" />;
      case "assignment": return <UserPlus {...iconProps} className="text-purple-600" />;
      case "update": return <RefreshCw {...iconProps} className="text-orange-500" />;
      case "mention": return <UserPlus {...iconProps} className="text-teal-600" />;
      case "new_ticket": return <TicketIconLucide {...iconProps} className="text-green-600" />;
      default: return <TicketIconLucide {...iconProps} className="text-gray-500" />;
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-start p-3.5 mb-3 rounded-xl border active:opacity-80 ${isNotificationReadLocally ? "bg-white border-gray-200 shadow-sm" : "bg-indigo-50 border-indigo-300 shadow-sm"}`}
      onPress={handlePressNotification}
    >
      <View className={`w-10 h-10 rounded-full mr-3.5 mt-0.5 items-center justify-center shrink-0 ${isNotificationReadLocally ? 'bg-gray-100' : 'bg-indigo-100'}`}>
        {/* CRITICAL FIX: Ensure actor has profileImageUrl before trying to display Image */}
        {actor && actor.profileImageUrl ? (
            <Image source={{ uri: actor.profileImageUrl }} className="w-full h-full rounded-full" />
        ) : (
            getIconForAction(actionType)
        )}
      </View>
      <View className="flex-1">
        <Text className="text-sm  text-gray-700 leading-snug">
          <Text className="font-semibold text-gray-800">{actor?.name || "Unknown User"}</Text> {/* Add fallback for actor.name */}
          <Text className="text-gray-600"> {message || actionType.replace(/_/g, " ")}</Text>
          {ticket && (<><Text className="text-gray-600"> on ticket </Text><Text className="font-semibold text-accent" numberOfLines={1} ellipsizeMode="tail">{ticket.title}</Text></>)}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">{formatNotificationTime(timestamp)}</Text>
      </View>
      {!isNotificationReadLocally && (<View className="w-2.5 h-2.5 bg-accent rounded-full ml-2 mt-1 self-start shrink-0" />)}
    </TouchableOpacity>
  );
};