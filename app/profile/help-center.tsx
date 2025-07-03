import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react-native";
import { router } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

export default function HelpCenter() {
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false);

  const helpCategories = [
    { title: "Get started", route: "/help/get-started" },
    { title: "How to Create Project", route: "/help/create-project" },
    { title: "How to Create Task", route: "/help/create-task" },
    { title: "Close Account", route: "/help/close-account" },
  ];

  const handleCategoryPress = (category: { title: any; route: any }) => {
    if (category.title === "Close Account") {
      setShowCloseAccountModal(true);
    } else {
      // Just log the action instead of navigating to non-existent routes
      console.log(`Would navigate to ${category.route}`);
    }
  };

  const CloseAccountModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showCloseAccountModal}
        // animationType="slide"
        onRequestClose={() => setShowCloseAccountModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowCloseAccountModal(false)}
        >
          <View className="flex-1 justify-end bg-black/10">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl">
                {/* Modal content */}
                <View className="px-6 pt-8 pb-10">
                  <Text className="text-3xl font-bold text-center text-slate-700 mb-5">
                    Close Account
                  </Text>

                  <Text className="text-center text-gray-500 text-xl mb-16">
                    Are you sure you want to close your account? You will lose
                    all your data and projects. This action cannot be undone.
                  </Text>

                  {/* Close account button */}
                  <TouchableOpacity
                    className="bg-red-400 rounded-xl py-5 mb-5"
                    activeOpacity={0.8}
                    onPress={() => console.log("Account closed")}
                  >
                    <Text className="text-center text-white font-semibold text-xl">
                      Close Account
                    </Text>
                  </TouchableOpacity>

                  {/* Cancel button */}
                  <TouchableOpacity
                    onPress={() => setShowCloseAccountModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-center text-gray-500 font-semibold text-xl">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Animated.View
        className="flex-1"
        exiting={
          Platform.OS === "android" ? SlideOutLeft.duration(300) : undefined
        }
        entering={
          Platform.OS === "android" ? SlideInRight.duration(300) : undefined
        }
      >
        <View
          className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-200 ${
            Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
          }`}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center flex-1 text-slate-800">
            Help Center
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View className="mx-6 mt-6 mb-4">
            <View className="flex-row items-center px-6 py-3 bg-gray-100 rounded-2xl">
              <Search size={28} color="#6B7280" />
              <TextInput
                placeholder="Find your task"
                placeholderTextColor="#6B7280"
                className="flex-1 ml-2 text-base text-gray-700"
              />
            </View>
          </View>

          {/* Help Categories */}
          <View className="mt-2">
            {helpCategories.map((category, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                onPress={() => handleCategoryPress(category)}
                className="flex-row justify-between items-center px-9 py-4"
              >
                <Text className="text-xl font-bold text-slate-700">
                  {category.title}
                </Text>
                <ChevronRight size={24} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 my-7" />

          {/* Get more questions section */}
          <View className="px-6 mb-6">
            <Text className="text-xl font-semibold text-slate-800 mb-3">
              Get more questions?
            </Text>
            <Text className="text-base text-gray-500 mb-6">
              You may also send a message to our customer support for further
              questions or information.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              className="border-2 border-indigo-400 rounded-2xl py-4"
              onPress={() => console.log("Contact support")}
            >
              <Text className="text-center text-indigo-500 font-medium text-lg">
                Get in touch with us
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 my-5" />

          {/* Chat with Us section */}
          <View className="px-6 mb-16">
            <Text className="text-xl font-semibold text-slate-800 mb-3">
              Chat with Us
            </Text>
            <Text className="text-base text-gray-500 mb-6">
              We are here to assist you better via online chat.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-indigo-400 rounded-2xl py-4"
              onPress={() => console.log("Open chat")}
            >
              <Text className="text-center text-white font-medium text-lg">
                Get in touch with us
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Close Account Modal */}
      <CloseAccountModal />
    </SafeAreaView>
  );
}
