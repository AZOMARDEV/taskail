// app/(tabs)/create.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView,
  Platform, Modal, Keyboard, TouchableWithoutFeedback, Pressable,
  KeyboardAvoidingView, StatusBar, Alert, Image, FlatList, ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { useTabBar } from "@/components/TabBar/TabBarContext"; // Ensure correct path
import {
  ChevronDown, Plus, X, Users, ArrowLeft, Search as SearchIconLucide, FileText as FileTextIcon, DollarSign, Package, Edit2, UserCircle, Type as TypeIconLucide,
  ArrowRightCircle
} from "lucide-react-native";
import TicketCard from "@/components/TicketCard"; // Ensure correct path
// Use types and hook from context
import { useTickets, Ticket, CounterpartyProfile, NewTicketData, MOCK_CONTEXT_COUNTERPARTIES } from '@/context/TicketsContext'; // Ensure correct path

// Mock Data for Counterparty SELECTION in the form
// This can be different from the counterparties used in the context's initial mock tickets.
// It's the pool of users/entities you can select from when creating a new ticket.
const MOCK_FORM_COUNTERPARTIES: CounterpartyProfile[] = [
  ...MOCK_CONTEXT_COUNTERPARTIES, // Optionally include context's default counterparties
  { id: 'cp_form_4', name: 'Derek Shepherd', profileImageUrl: 'https://i.pravatar.cc/150?img=40' },
  { id: 'cp_form_5', name: 'Isabelle Lightwood', profileImageUrl: 'https://i.pravatar.cc/150?img=45' },
  { id: 'cp_form_6', name: 'Ken Adams', profileImageUrl: 'https://i.pravatar.cc/150?img=50' },
  { id: 'cp_form_7', name: 'Laura Palmer' }, // Example without profile image
];

// Define keys for form fields that can have errors
type TicketFormFieldKeys = 'title' | 'itemDescription' | 'quantity' | 'pricePerUnit' | 'currency' | 'counterparty';

export default function TicketsPage() {
  // --- Modal States ---
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showCounterpartyModal, setShowCounterpartyModal] = useState(false);

  // --- Ticket Form State ---
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketType, setTicketType] = useState<"buy" | "sell">("sell");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [selectedCounterparty, setSelectedCounterparty] = useState<CounterpartyProfile | null>(null);
  const [notes, setNotes] = useState("");

  // --- Error State ---
  const [error, setError] = useState<string | null>(null); // General form error
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<TicketFormFieldKeys, string>>>({});

  // --- Search and UI State ---
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For filtering tickets list
  const [counterpartySearchTerm, setCounterpartySearchTerm] = useState(""); // For filtering counterparties in modal
  const searchInputRef = useRef<TextInput>(null);

  // --- Context and Navigation ---
  const { setIsTabBarVisible } = useTabBar();
  const { tickets, addTicket, deleteTicket, loading: ticketsLoading } = useTickets(); // Consume from context

  // --- Effects ---
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setIsTabBarVisible(false));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setIsTabBarVisible(true));
    return () => { showSub.remove(); hideSub.remove(); };
  }, [setIsTabBarVisible]);

  // --- Navigation Handlers ---
  const navigateToDashboard = () => router.replace("/(tabs)/dashboard");

  const handleNavigateToTicket = (ticketId: string) => {
    const ticketToNavigate = tickets.find(t => t.id === ticketId);
    if (ticketToNavigate) {
      router.push({
        pathname: `/ticket/[id]`,
        params: {
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
          createdAt: ticketToNavigate.createdAt.toISOString(),
        },
      });
    } else {
      Alert.alert("Error", "Could not load ticket details. It might have been deleted.");
    }
  };

  // --- Form Handling ---
  const resetForm = () => {
    setTicketTitle(""); setTicketType("sell"); setItemDescription("");
    setQuantity("1"); setPricePerUnit(""); setCurrency("USD");
    setSelectedCounterparty(null); setNotes("");
    setError(null); setFieldErrors({});
    setCounterpartySearchTerm(""); // Also reset counterparty search in form modal
  };

  const openCreateTicketModal = () => { resetForm(); setShowCreateTicketModal(true); };
  const closeCreateTicketModal = () => { setShowCreateTicketModal(false); resetForm(); };

  const validateForm = (): boolean => {
    const errors: Partial<Record<TicketFormFieldKeys, string>> = {};
    if (!ticketTitle.trim()) errors.title = "Ticket title cannot be empty.";
    if (!itemDescription.trim()) errors.itemDescription = "Item description cannot be empty.";
    const numQuantity = parseFloat(quantity);
    if (!quantity.trim() || isNaN(numQuantity) || numQuantity <= 0) errors.quantity = "Enter a valid quantity.";
    const numPrice = parseFloat(pricePerUnit);
    if (!pricePerUnit.trim() || isNaN(numPrice) || numPrice < 0) errors.pricePerUnit = "Enter a valid price.";
    if (!currency.trim()) errors.currency = "Currency is required.";
    if (!selectedCounterparty) errors.counterparty = "Please select a counterparty.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTicket = () => {
    if (!validateForm()) {
      setError("Please fill all required fields correctly.");
      return;
    }
    setError(null); // Clear general error if validation passes

    const newTicketData: NewTicketData = {
      title: ticketTitle.trim(),
      type: ticketType,
      itemDescription: itemDescription.trim(),
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      currency: currency.trim().toUpperCase(),
      counterparty: selectedCounterparty!,
      notes: notes.trim(),
    };
    addTicket(newTicketData);
    closeCreateTicketModal();
  };

  const handleDeleteTicket = (ticketId: string) => {
    Alert.alert(
      "Delete Ticket",
      `Are you sure you want to delete this ticket? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTicket(ticketId) },
      ],
      { cancelable: true }
    );
  };

  // --- UI Element Interactions (Dropdowns, Modals) ---
  const availableCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"]; // Added INR
  const toggleCurrencyDropdown = () => setShowCurrencyDropdown(!showCurrencyDropdown);
  const selectCurrency = (value: string) => {
    setCurrency(value);
    setShowCurrencyDropdown(false);
    if (fieldErrors.currency) setFieldErrors(prev => ({...prev, currency: undefined}));
  };

  const openCounterpartySelectionModal = () => { setCounterpartySearchTerm(""); setShowCounterpartyModal(true); };
  const closeCounterpartySelectionModal = () => setShowCounterpartyModal(false);

  const handleSelectCounterparty = (cp: CounterpartyProfile) => {
    setSelectedCounterparty(cp);
    if (fieldErrors.counterparty) setFieldErrors(prev => ({...prev, counterparty: undefined}));
    closeCounterpartySelectionModal();
  };

  // --- Search and Filtering ---
  const handleOpenSearch = () => { setIsSearchActive(true); setTimeout(() => searchInputRef.current?.focus(), 100); };
  const handleCloseSearch = () => { setIsSearchActive(false); setSearchQuery(""); Keyboard.dismiss(); };

  const handleContentAreaPress = () => { // For dismissing search or dropdowns on tap outside
    if (isSearchActive && !showCreateTicketModal && !showCounterpartyModal && !showCurrencyDropdown) {
      handleCloseSearch();
    }
    if (showCurrencyDropdown) setShowCurrencyDropdown(false);
  };

  // Filtered list of counterparties for the selection modal
  const filteredCpListForForm = useMemo(() => MOCK_FORM_COUNTERPARTIES.filter(cp =>
    cp.name.toLowerCase().includes(counterpartySearchTerm.toLowerCase())
  ), [counterpartySearchTerm]);

  // Filtered list of tickets for display
  const displayedTickets = useMemo(() => {
    if (!tickets) return []; // tickets might be undefined initially if context isn't fully loaded
    if (!searchQuery.trim()) return tickets; // Already sorted by context
    const SQuery = searchQuery.toLowerCase();
    return tickets.filter(
      ticket =>
        ticket.title.toLowerCase().includes(SQuery) ||
        ticket.itemDescription.toLowerCase().includes(SQuery) ||
        ticket.counterparty.name.toLowerCase().includes(SQuery) ||
        ticket.currency.toLowerCase().includes(SQuery) ||
        (ticket.notes && ticket.notes.toLowerCase().includes(SQuery))
    );
  }, [tickets, searchQuery]);


  // --- Render Logic for Ticket List ---
  const renderTickets = () => {
    if (ticketsLoading && !tickets.length) { // Show loader if tickets are loading and none are present yet
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="mt-3 text-gray-600 font-['Outfit-Regular']">Loading your tickets...</Text>
        </View>
      );
    }

    if (displayedTickets.length === 0) { // Handles "No results" or "No tickets yet"
      if (isSearchActive && searchQuery.trim() !== "") {
        return (
          <View className="flex-1 items-center justify-center px-6 pt-10">
            <SearchIconLucide size={70} color="#A1A1AA" strokeWidth={1.5} className="mb-5 opacity-60" />
            <Text className="text-xl font-['Outfit-SemiBold'] text-center text-gray-700 mb-2">No Tickets Found</Text>
            <Text className="text-base text-gray-500 text-center mb-8 font-['Outfit-Regular']">
              Try adjusting your search term or clear the search to see all tickets.
            </Text>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCloseSearch}
                className="bg-indigo-100 px-6 py-2.5 rounded-full flex-row items-center"
            >
                <Text className="text-indigo-700 font-['Outfit-SemiBold'] text-sm">Clear Search</Text>
            </TouchableOpacity>
          </View>
        );
      }
      // This is the empty state when NO tickets exist AT ALL (and not searching)
      return (
        <View className="flex-1 items-center justify-center px-6 -mt-10"> {/* -mt-10 to pull it up a bit */}
          <View className="w-48 h-48 mb-6 bg-indigo-100 rounded-full items-center justify-center">
            <FileTextIcon size={80} color="#6366F1" strokeWidth={1.5}/>
          </View>
          <Text className="text-xl font-['Outfit-Bold'] text-center text-gray-800 mb-2">No Tickets Yet</Text>
          <Text className="text-base text-gray-500 text-center mb-8 font-['Outfit-Regular']">
            Ready to create your first buy or sell ticket? Tap the button below.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openCreateTicketModal}
            className="bg-accent px-8 py-3.5 rounded-full flex-row items-center shadow-md"
          >
            <Plus size={20} color="white" className="mr-2" />
            <Text className="text-white font-['Outfit-SemiBold'] text-base">Create New Ticket</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // Render actual ticket cards
    return (
      <View className="w-full">
        {displayedTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onDelete={() => handleDeleteTicket(ticket.id)}
            onPress={() => handleNavigateToTicket(ticket.id)}
          />
        ))}
      </View>
    );
  };

  // --- Main Component Return ---
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white ${Platform.OS === "ios" ? "pt-3" : "pt-10"}`}>
        <TouchableOpacity
          onPress={isSearchActive ? handleCloseSearch : navigateToDashboard}
          className="p-2 -ml-2"
        >
          <ArrowLeft size={26} color="#374151" />
        </TouchableOpacity>

        {isSearchActive ? (
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg mx-2">
            <TextInput
              ref={searchInputRef}
              className="flex-1 h-10 px-3 py-1 text-base text-gray-800 font-['Outfit-Regular']"
              placeholder="Search by title, item, person..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} className="p-2 mr-1">
                    <X size={18} color="#6B7280" />
                </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text className="text-xl font-['Outfit-Bold'] text-center flex-1 text-gray-800 mx-2">My Tickets</Text>
        )}

        {!isSearchActive && tickets && tickets.length > 0 && (
            <View className="flex-row items-center">
                <TouchableOpacity onPress={handleOpenSearch} className="p-1">
                    <SearchIconLucide size={22} color="#4B5563" />
                </TouchableOpacity>
            </View>
        )}
        {(!isSearchActive && (!tickets || tickets.length === 0)) && (<View className="w-[30px]" />)}
      </View>

      <TouchableWithoutFeedback onPress={handleContentAreaPress} accessible={false}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              flexGrow: 1,
              justifyContent: displayedTickets.length === 0 && !ticketsLoading ? "center" : "flex-start",
              paddingBottom: tickets && tickets.length > 0 ? 90 : 20, // Adjust padding based on FAB visibility
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => {
                if (isSearchActive || showCurrencyDropdown || showCounterpartyModal) Keyboard.dismiss();
                if(showCurrencyDropdown) setShowCurrencyDropdown(false); // Dismiss currency dropdown on scroll
            }}
          >
            {renderTickets()}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {(!isSearchActive || (isSearchActive && displayedTickets.length > 0)) && tickets && tickets.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openCreateTicketModal}
          className="absolute bottom-24 right-6 bg-accent w-14 h-14 rounded-full items-center justify-center shadow-xl z-20"
        >
          <Plus size={28} color="white" />
        </TouchableOpacity>
      )}

      <Modal
        visible={showCreateTicketModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCreateTicketModal}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); if (showCurrencyDropdown) setShowCurrencyDropdown(false); }}>
            <View className="flex-1 bg-black/60 justify-end">
              <View className="bg-white rounded-t-3xl p-6 pt-5 max-h-[90vh]">
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-xl font-['Outfit-Bold'] text-gray-800">Create New Ticket</Text>
                    <TouchableOpacity onPress={closeCreateTicketModal} className="p-1">
                      <X size={22} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {error && <Text className="text-red-600 text-sm text-center mb-3 font-['Outfit-Regular']">{error}</Text>}

                  <View className="mb-4">
                    <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Ticket Title</Text>
                    <TextInput
                      className={`bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border ${fieldErrors.title ? "border-red-500" : "border-gray-200"}`}
                      placeholder="E.g., Sale of Vintage Camera"
                      placeholderTextColor="#9CA3AF"
                      value={ticketTitle}
                      onChangeText={(t) => { setTicketTitle(t); if (fieldErrors.title) setFieldErrors(prev => ({...prev, title: undefined})); }}
                    />
                    {fieldErrors.title && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.title}</Text>}
                  </View>

                  <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Ticket Type</Text>
                  <View className="flex-row mb-4 space-x-3">
                    <TouchableOpacity
                      activeOpacity={0.7} onPress={() => setTicketType("sell")}
                      className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border-2 ${ticketType === "sell" ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-200"}`}
                    >
                      <ArrowRightCircle size={18} color={ticketType === "sell" ? "#10B981" : "#6B7280"} className="mr-1.5" />
                      <Text className={`font-['Outfit-SemiBold'] ${ticketType === "sell" ? "text-green-700" : "text-gray-700"}`}>Sell</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7} onPress={() => setTicketType("buy")}
                      className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg border-2 ${ticketType === "buy" ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-gray-200"}`}
                    >
                      <TypeIconLucide size={18} color={ticketType === "buy" ? "#3B82F6" : "#6B7280"} className="mr-1.5" />
                      <Text className={`font-['Outfit-SemiBold'] ${ticketType === "buy" ? "text-blue-700" : "text-gray-700"}`}>Buy</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Item/Service Description</Text>
                    <TextInput
                      className={`bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border ${fieldErrors.itemDescription ? "border-red-500" : "border-gray-200"} h-24`}
                      placeholder="Describe the item or service being bought/sold..."
                      placeholderTextColor="#9CA3AF"
                      value={itemDescription}
                      onChangeText={(t) => { setItemDescription(t); if (fieldErrors.itemDescription) setFieldErrors(prev => ({...prev, itemDescription: undefined})); }}
                      multiline={true} textAlignVertical="top"
                    />
                     {fieldErrors.itemDescription && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.itemDescription}</Text>}
                  </View>

                  <View className="flex-row mb-4 space-x-3">
                    <View className="flex-1">
                      <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Quantity</Text>
                      <TextInput
                        className={`bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border ${fieldErrors.quantity ? "border-red-500" : "border-gray-200"}`}
                        placeholder="1" value={quantity} keyboardType="numeric"
                        onChangeText={(t) => { setQuantity(t.replace(/[^0-9.]/g, '')); if (fieldErrors.quantity) setFieldErrors(prev => ({...prev, quantity: undefined}));}}
                      />
                      {fieldErrors.quantity && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.quantity}</Text>}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Price per Item</Text>
                      <TextInput
                        className={`bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border ${fieldErrors.pricePerUnit ? "border-red-500" : "border-gray-200"}`}
                        placeholder="0.00" value={pricePerUnit} keyboardType="numeric"
                        onChangeText={(t) => { setPricePerUnit(t.replace(/[^0-9.]/g, '')); if (fieldErrors.pricePerUnit) setFieldErrors(prev => ({...prev, pricePerUnit: undefined}));}}
                      />
                      {fieldErrors.pricePerUnit && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.pricePerUnit}</Text>}
                    </View>
                  </View>

                  <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Currency</Text>
                  <View className="relative mb-4 z-10">
                    <TouchableOpacity activeOpacity={0.7} onPress={toggleCurrencyDropdown}
                      className={`flex-row items-center justify-between p-3.5 bg-gray-100 border rounded-xl ${fieldErrors.currency ? "border-red-500" : (showCurrencyDropdown ? "border-indigo-400" : "border-gray-200") }`}>
                      <View className="flex-row items-center">
                        <DollarSign size={18} color="#6B7280" className="mr-2" />
                        <Text className="text-gray-800 font-['Outfit-Medium']">{currency}</Text>
                      </View>
                      <ChevronDown size={18} color="#6B7280" className={`${showCurrencyDropdown ? "transform rotate-180" : ""}`}/>
                    </TouchableOpacity>
                    {fieldErrors.currency && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.currency}</Text>}
                    {showCurrencyDropdown && (
                      <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-20 max-h-48">
                         <ScrollView nestedScrollEnabled>
                            {availableCurrencies.map(c => (
                                <Pressable key={c} onPress={() => selectCurrency(c)} className={`p-3 border-b border-gray-100 ${currency === c ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                                    <Text className={`font-['Outfit-Regular'] ${currency === c ? "text-indigo-700 font-['Outfit-Medium']" : "text-gray-700"}`}>{c}</Text>
                                </Pressable>
                            ))}
                         </ScrollView>
                      </View>
                    )}
                  </View>

                  <View className="mb-4">
                    <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Counterparty (Buyer/Seller)</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={openCounterpartySelectionModal}
                      className={`flex-row items-center justify-between p-3.5 bg-gray-100 border rounded-xl ${fieldErrors.counterparty ? "border-red-500" : "border-gray-200"}`}
                    >
                      <View className="flex-row items-center flex-1">
                        {selectedCounterparty?.profileImageUrl ? (
                          <Image source={{ uri: selectedCounterparty.profileImageUrl }} className="w-7 h-7 rounded-full mr-2.5" />
                        ) : (
                          <View className={`w-7 h-7 rounded-full ${selectedCounterparty ? 'bg-indigo-100': 'bg-gray-200'} items-center justify-center mr-2.5`}>
                            <UserCircle size={18} color={selectedCounterparty ? "#4F46E5" : "#9CA3AF"} />
                          </View>
                        )}
                        <Text className={`text-base font-['Outfit-Regular'] ${selectedCounterparty ? 'text-gray-800' : 'text-gray-400'}`} numberOfLines={1}>
                          {selectedCounterparty ? selectedCounterparty.name : "Select Counterparty"}
                        </Text>
                      </View>
                      <ChevronDown size={18} color="#6B7280" />
                    </TouchableOpacity>
                    {fieldErrors.counterparty && <Text className="text-red-600 text-xs ml-1 mt-1 font-['Outfit-Regular']">{fieldErrors.counterparty}</Text>}
                  </View>

                   <View className="mb-6">
                    <Text className="text-sm font-['Outfit-Medium'] text-gray-600 mb-1.5 ml-1">Notes (Optional)</Text>
                    <TextInput
                      className="bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border border-gray-200 h-24"
                      placeholder="Any additional details or terms..." value={notes} onChangeText={setNotes}
                      multiline={true} textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity activeOpacity={0.8} onPress={handleCreateTicket}
                    className="bg-accent py-4 rounded-xl items-center justify-center shadow-md mb-4">
                    <Text className="text-white font-['Outfit-SemiBold'] text-base">Create Ticket</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showCounterpartyModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCounterpartySelectionModal}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); closeCounterpartySelectionModal();}}>
            <View className="flex-1 bg-black/70 justify-center items-center p-4">
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[80vh]">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-['Outfit-Bold'] text-gray-800">Select Counterparty</Text>
                    <TouchableOpacity onPress={closeCounterpartySelectionModal} className="p-1">
                      <X size={22} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    className="bg-gray-100 p-3.5 rounded-xl text-base font-['Outfit-Regular'] border border-gray-200 mb-4"
                    placeholder="Search by name..."
                    placeholderTextColor="#9CA3AF"
                    value={counterpartySearchTerm}
                    onChangeText={setCounterpartySearchTerm}
                    autoFocus={Platform.OS === 'android'} // Consider autofocus based on UX preference
                  />
                  <FlatList
                    data={filteredCpListForForm}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: cp }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectCounterparty(cp)}
                        className="flex-row items-center py-3.5 px-2 border-b border-gray-100 active:bg-gray-50"
                      >
                        {cp.profileImageUrl ? (
                          <Image source={{ uri: cp.profileImageUrl }} className="w-10 h-10 rounded-full mr-3" />
                        ) : (
                          <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                            <UserCircle size={24} color="#6B7280" />
                          </View>
                        )}
                        <Text className="text-base text-gray-700 font-['Outfit-Medium']">{cp.name}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <Users size={40} color="#A1A1AA" className="mb-3 opacity-70"/>
                            <Text className="text-center text-gray-500 font-['Outfit-Regular']">
                                {counterpartySearchTerm ? "No counterparties match your search." : "No counterparties available."}
                            </Text>
                        </View>
                    }
                    keyboardShouldPersistTaps="handled" // Good for scrollable lists with touchables
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}