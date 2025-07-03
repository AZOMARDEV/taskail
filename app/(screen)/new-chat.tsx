import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { router } from "expo-router";

// Mock data for contacts
const mockContacts = [
  {
    id: 1,
    name: "Annette Black",
    email: "annetteblack@gmail.com",
    section: "A",
  },
  {
    id: 2,
    name: "Kathryn Murphy",
    email: "kathrynmurphy@gmail.com",
    section: "A",
  },
  {
    id: 3,
    name: "Darlene Robertson",
    email: "darlenerobertson@gmail.com",
    section: "B",
  },
  { id: 4, name: "Devon Lane", email: "devonlane@gmail.com", section: "D" },
  {
    id: 5,
    name: "Esther Howard",
    email: "estherhoward@gmail.com",
    section: "D",
  },
  {
    id: 6,
    name: "Darrell Steward",
    email: "darrellsteward@gmail.com",
    section: "D",
  },
  { id: 7, name: "Dino Sambara", email: "dinosambara@gmail.com", section: "D" },
];

export default function NewChatPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search query
  const filteredContacts = searchQuery
    ? mockContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockContacts;

  // Group contacts by section
  const groupedContacts = filteredContacts.reduce(
    (groups: { [key: string]: typeof mockContacts }, contact) => {
      const section = contact.section;
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(contact);
      return groups;
    },
    {}
  );

  // Handle contact selection
  const handleSelectContact = (contact: {
    id?: number;
    name: any;
    email: any;
    section?: string;
  }) => {
    router.push({
      pathname: "/new-message",
      params: {
        email: contact.email,
        name: contact.name,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 ${
          Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
        }`}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl mr-5 font-bold text-center flex-1 text-slate-800">
          New Chat
        </Text>
      </View>

      {/* Search Bar */}
      <View className="mx-4 my-4">
        <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-2xl">
          <Search size={24} color="#6B7280" />
          <TextInput
            placeholder="Search contacts"
            placeholderTextColor="#6B7280"
            className="flex-1 ml-2 text-base text-gray-700"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Contact List */}
      <ScrollView className="flex-1">
        {Object.keys(groupedContacts)
          .sort()
          .map((section) => (
            <View key={section}>
              {/* Section Header */}
              <View className="px-4 py-2 bg-gray-50">
                <Text className="text-xl font-bold text-gray-800">
                  {section}
                </Text>
              </View>

              {/* Contacts in section */}
              {groupedContacts[section].map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                  onPress={() => handleSelectContact(contact)}
                >
                  <View className="w-10 h-10 bg-gray-200 rounded-full">
                    <Image
                      source={{ uri: "https://via.placeholder.com/150" }}
                      className="w-full h-full rounded-full"
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="text-lg font-medium text-gray-800">
                      {contact.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {contact.email}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
