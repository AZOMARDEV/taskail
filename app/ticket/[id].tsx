// app/ticket/[id].tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View, Text, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar, Alert, ActivityIndicator, Image, TextInput,
  Keyboard
} from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import {
  ArrowLeft, Calendar, DollarSign, Package, Type as TypeIcon, UserCircle, FileText, Trash2,
  Users, MessageCircle as MessageIcon, Activity, Tag, Send, Edit3 // New Icons
} from "lucide-react-native";
// Import extended Ticket, Comment, ActivityLogEntry, CounterpartyProfile types AND context actions
import { useTickets, Ticket, Comment, ActivityLogEntry, CounterpartyProfile, MOCK_CONTEXT_COUNTERPARTIES } from '@/context/TicketsContext'; // Adjust path
import { v4 as uuidv4 } from 'uuid'; // For new comment IDs

// Robust date formatting (from previous response)
const formatDateForDisplay = (dateInput: string | Date | undefined, includeTime: boolean = true): string => {
  if (!dateInput) return "Date unknown";
  let date;
  if (typeof dateInput === 'string') date = new Date(dateInput);
  else if (dateInput instanceof Date) date = dateInput;
  else { console.warn("Invalid date type:", dateInput); return "Invalid Date"; }

  if (isNaN(date.getTime())) { console.warn("Invalid date value:", dateInput); return "Invalid Date"; }
  
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return date.toLocaleDateString("en-US", options);
};

const formatRelativeTime = (timestamp: Date): string => {
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
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Temporary flag for Alert to prevent spamming
let alertDisplayedForNullTicket = false;

// Current user mock (replace with actual auth user logic)
const currentMockUser = MOCK_CONTEXT_COUNTERPARTIES.find(cp => cp.id === 'cp_user_current')!;


export default function TicketDetailScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string; /* other params for initial title */ title?: string; }>();
  const ticketIdFromParams = useMemo(() => params.id, [params.id]);

  const { 
    getTicketById, 
    deleteTicket, 
    loading: ticketsLoading,
    addCommentToTicket, // Get new actions
    updateTicketStatus,
    assignUserToTicket,
  } = useTickets();
  const [ticketData, setTicketData] = useState<Ticket | null | undefined>(undefined);
  const [newCommentText, setNewCommentText] = useState("");

  // Effect for navigation title (from previous response)
  useEffect(() => {
    if (ticketData) navigation.setOptions({ title: ticketData.title });
    else if (ticketsLoading || ticketData === undefined) navigation.setOptions({ title: params.title || "Loading Ticket..." });
    else navigation.setOptions({ title: "Ticket Not Found" });
  }, [navigation, ticketData, ticketsLoading, params.title]);

  // Effect for fetching/setting ticket data (from previous response - this logic is good)
  useEffect(() => {
    if (!ticketIdFromParams) { setTicketData(null); return; }
    if (ticketsLoading) { setTicketData(undefined); return; }
    const fetchedTicketFromContext = getTicketById(ticketIdFromParams);
    if (fetchedTicketFromContext) setTicketData(fetchedTicketFromContext);
    else setTicketData(null);
  }, [ticketIdFromParams, getTicketById, ticketsLoading]);


  const handleDelete = () => {
    if (!ticketData || !getTicketById(ticketData.id)) { /* ... (same as before) ... */ return; }
    Alert.alert( "Delete Ticket", `Are you sure you want to delete "${ticketData.title}"?`,
      [ { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => { deleteTicket(ticketData.id); router.replace('/(tabs)/create'); }}
      ], { cancelable: true }
    );
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !ticketData) return;
    addCommentToTicket(ticketData.id, {
      author: currentMockUser, // Replace with actual current user from auth
      text: newCommentText.trim(),
    });
    setNewCommentText("");
    Keyboard.dismiss();
  };
  
  // Example function to simulate changing status
  const handleChangeStatus = (newStatus: Ticket['status']) => {
      if (!ticketData || !newStatus) return;
      updateTicketStatus(ticketData.id, newStatus, currentMockUser);
      // UI will update when ticketData from context changes
  };


  if (ticketsLoading || ticketData === undefined) { /* ... (Loading UI same as before) ... */ 
    return ( <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center"><StatusBar barStyle="dark-content" /><ActivityIndicator size="large" color="#4F46E5" /><Text className="mt-3 text-gray-600 font-['Outfit-Regular']">Loading Ticket...</Text></SafeAreaView>);
  }

  if (ticketData === null) { /* ... (Not Found UI same as before, ensure fonts) ... */ 
    if (!alertDisplayedForNullTicket) {
      alertDisplayedForNullTicket = true;
      Alert.alert( "Ticket Not Found", `Details for ID "${ticketIdFromParams || 'N/A'}" unavailable.`,
        [{ text: "OK", onPress: () => { alertDisplayedForNullTicket = false; if(router.canGoBack()) router.back(); else router.replace("/(tabs)/dashboard"); }}],
        { cancelable: false, onDismiss: () => { alertDisplayedForNullTicket = false; }}
      );
    }
    return (<SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-5"><StatusBar barStyle="dark-content" /><TypeIcon size={60} color="#EF4444" className="mb-4 opacity-70" /><Text className="text-red-600 text-xl font-['Outfit-SemiBold'] text-center mb-2">Ticket Not Found</Text><Text className="text-gray-600 text-base text-center mb-6 font-['Outfit-Regular']">This ticket may have been deleted or the link is outdated.</Text><TouchableOpacity onPress={() => {if(router.canGoBack()) router.back(); else router.replace("/(tabs)/dashboard");}} className="bg-accent px-8 py-3 rounded-lg"><Text className="text-white font-['Outfit-Medium']">Go Back</Text></TouchableOpacity></SafeAreaView>);
  }

  const { title, type, itemDescription, quantity, pricePerUnit, currency, counterparty, notes, createdAt,
          status, assignees, comments, activityLog // Destructure new fields
        } = ticketData;
  const totalPrice = Number(quantity) * Number(pricePerUnit);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white ${Platform.OS === "ios" ? "pt-3" : "pt-10"}`}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={26} color="#374151" /></TouchableOpacity>
        <Text className="text-lg font-['Outfit-SemiBold'] text-gray-800 text-center flex-1 mx-2" numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <TouchableOpacity onPress={handleDelete} className="p-1"><Trash2 size={22} color="#EF4444" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 70 }} showsVerticalScrollIndicator={false} className="flex-1">
        {/* General Info Card (same as before, ensure fonts) */}
        <View className="bg-white rounded-xl p-5 mx-4 mt-4 mb-5 shadow-sm border border-gray-100">
          {/* ... title, type, createdAt, counterparty ... */}
          <View className="flex-row justify-between items-start mb-3"><Text className="text-xl font-['Outfit-Bold'] text-gray-800 flex-1 mr-2" numberOfLines={3}>{title}</Text><View className={`px-3 py-1 rounded-full ${type === 'sell' ? 'bg-green-100' : 'bg-blue-100'}`}><Text className={`text-sm font-['Outfit-SemiBold'] capitalize ${type === 'sell' ? 'text-green-700' : 'text-blue-700'}`}>{type}</Text></View></View>
          <View className="space-y-2.5 mt-2">
            <View className="flex-row items-center"><Calendar size={15} color="#6B7280" className="mr-3" /><Text className="text-sm text-gray-600 font-['Outfit-Regular']">Created: {formatDateForDisplay(createdAt)}</Text></View>
            <View className="flex-row items-center">{counterparty.profileImageUrl ? <Image source={{uri: counterparty.profileImageUrl}} className="w-5 h-5 rounded-full mr-2.5" /> : <UserCircle size={18} color="#6B7280" className="mr-2.5" />}<Text className="text-sm text-gray-600 font-['Outfit-Regular']">Counterparty: </Text><Text className="text-sm font-['Outfit-Medium'] text-gray-700 ml-1" numberOfLines={1}>{counterparty.name}</Text></View>
          </View>
        </View>
        
        {/* Item Details Card (same as before, ensure fonts) */}
        <View className="bg-white rounded-xl p-5 mx-4 mb-5 shadow-sm border border-gray-100">
          {/* ... description, quantity, price, total ... */}
          <Text className="text-base font-['Outfit-SemiBold'] text-gray-700 mb-3">Item Details</Text>
          {/* ... (item details content, make sure to use Outfit fonts) ... */}
          <View className="space-y-2.5">
            <View className="flex-row items-start"><FileText size={15} color="#6B7280" className="mr-3 mt-0.5" /><View className="flex-1"><Text className="text-xs text-gray-500 mb-0.5 font-['Outfit-Regular']">Description</Text><Text className="text-sm text-gray-700 font-['Outfit-Regular']">{itemDescription}</Text></View></View>
            <View className="flex-row items-center"><Package size={15} color="#6B7280" className="mr-3" /><Text className="text-xs text-gray-500 font-['Outfit-Regular']">Quantity: </Text><Text className="text-sm font-['Outfit-Medium'] text-gray-700 ml-1">{quantity}</Text></View>
            <View className="flex-row items-center"><DollarSign size={15} color="#6B7280" className="mr-3" /><Text className="text-xs text-gray-500 font-['Outfit-Regular']">Price/Item: </Text><Text className="text-sm font-['Outfit-Medium'] text-gray-700 ml-1">{Number(pricePerUnit).toFixed(2)} {currency}</Text></View>
            <View className="border-t border-gray-200 mt-3 pt-3 flex-row items-center"><DollarSign size={18} color={type === 'sell' ? "#10B981" : "#3B82F6"} className="mr-2.5" /><Text className="text-sm text-gray-500 font-['Outfit-Regular']">Total: </Text><Text className={`text-base font-['Outfit-Bold'] ${type === 'sell' ? "text-green-600" : "text-blue-600"} ml-1`}>{totalPrice.toFixed(2)} {currency}</Text></View>
          </View>
        </View>

        {/* Notes Card (same as before, ensure fonts) */}
        {notes && notes.trim() !== "" && ( <View className="bg-white rounded-xl p-5 mx-4 mb-5 shadow-sm border border-gray-100"><Text className="text-base font-['Outfit-SemiBold'] text-gray-700 mb-2">Additional Notes</Text><Text className="text-sm text-gray-600 leading-relaxed font-['Outfit-Regular']">{notes}</Text></View> )}

        {/* --- NEW SECTIONS --- */}

        {/* Status & Assignees Card */}
        <View className="bg-white rounded-xl p-5 mx-4 mb-5 shadow-sm border border-gray-100">
            <Text className="text-base font-['Outfit-SemiBold'] text-gray-700 mb-3">Status & Team</Text>
            <View className="flex-row items-center mb-3">
                <Tag size={16} color="#6B7280" className="mr-3"/>
                <Text className="text-sm font-['Outfit-Regular'] text-gray-600">Status: </Text>
                <Text className="text-sm font-['Outfit-Medium'] text-gray-800 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md ml-1">{status || "Open"}</Text>
                 {/* Add TouchableOpacity here to change status if needed */}
            </View>
            {assignees && assignees.length > 0 && (
                <View className="flex-row items-start">
                    <Users size={16} color="#6B7280" className="mr-3 mt-1"/>
                    <View className="flex-1">
                        <Text className="text-sm font-['Outfit-Regular'] text-gray-600 mb-1">Assigned to: </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {assignees.map(user => (
                                <View key={user.id} className="flex-row items-center bg-gray-100 px-2 py-1 rounded-full">
                                    {user.profileImageUrl ? <Image source={{uri: user.profileImageUrl}} className="w-4 h-4 rounded-full mr-1.5"/> : <UserCircle size={14} color="#60A5FA" className="mr-1"/>}
                                    <Text className="text-xs font-['Outfit-Regular'] text-gray-700">{user.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            )}
        </View>

        {/* Comments Section */}
        <View className="bg-white rounded-xl p-5 mx-4 mb-5 shadow-sm border border-gray-100">
            <Text className="text-base font-['Outfit-SemiBold'] text-gray-700 mb-4">Comments ({comments?.length || 0})</Text>
            {comments && comments.length > 0 ? (
                comments.slice().sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(comment => ( // Sort oldest first for display
                    <View key={comment.id} className="flex-row items-start mb-4 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                        {comment.author.profileImageUrl ? (
                            <Image source={{uri: comment.author.profileImageUrl}} className="w-8 h-8 rounded-full mr-3"/>
                        ) : (
                            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                                <UserCircle size={20} color="#6B7280"/>
                            </View>
                        )}
                        <View className="flex-1">
                            <View className="flex-row justify-between items-center mb-0.5">
                                <Text className="text-sm font-['Outfit-SemiBold'] text-gray-800">{comment.author.name}</Text>
                                <Text className="text-xs text-gray-500 font-['Outfit-Regular']">{formatRelativeTime(comment.createdAt)}</Text>
                            </View>
                            <Text className="text-sm text-gray-700 font-['Outfit-Regular'] leading-snug">{comment.text}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text className="text-sm text-gray-500 font-['Outfit-Regular']">No comments yet.</Text>
            )}
            {/* Add New Comment Input */}
            <View className="mt-4 pt-4 border-t border-gray-200 flex-row items-center">
                <TextInput
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                    multiline
                    className="flex-1 bg-gray-100 rounded-lg p-3 mr-2 text-sm font-['Outfit-Regular'] min-h-[44px]"
                    placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={handleAddComment} disabled={!newCommentText.trim()} className={`p-2.5 rounded-lg ${!newCommentText.trim() ? 'bg-gray-300' : 'bg-accent'}`}>
                    <Send size={20} color="white"/>
                </TouchableOpacity>
            </View>
        </View>

        {/* Activity Log Section */}
        {activityLog && activityLog.length > 0 && (
            <View className="bg-white rounded-xl p-5 mx-4 mb-5 shadow-sm border border-gray-100">
                <Text className="text-base font-['Outfit-SemiBold'] text-gray-700 mb-4">Activity Log</Text>
                {activityLog.slice().sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(entry => ( // Sort newest first
                    <View key={entry.id} className="flex-row items-start mb-3 pb-2 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                        {entry.actor.profileImageUrl ? (
                            <Image source={{uri: entry.actor.profileImageUrl}} className="w-7 h-7 rounded-full mr-2.5 mt-0.5"/>
                        ) : (
                             <View className="w-7 h-7 rounded-full bg-gray-200 items-center justify-center mr-2.5 mt-0.5">
                                <UserCircle size={18} color="#6B7280"/>
                            </View>
                        )}
                        <View className="flex-1">
                            <Text className="text-xs text-gray-700 font-['Outfit-Regular'] leading-normal">
                                <Text className="font-['Outfit-Medium']">{entry.actor.name}</Text> {entry.action}
                            </Text>
                            <Text className="text-[10px] text-gray-400 font-['Outfit-Regular'] mt-0.5">{formatRelativeTime(entry.timestamp)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}