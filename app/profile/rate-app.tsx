import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { ArrowLeft, Star } from "lucide-react-native";
import { router } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

export default function RateApp() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarPress = (selectedRating: React.SetStateAction<number>) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
      // Here you would typically send the rating to your backend
      console.log(`User submitted rating: ${rating}`);

      // Optionally navigate away after a delay
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  };

  const renderFeedbackMessage = () => {
    const messages: { [key: number]: string } = {
      1: "We're sorry to hear that. We'll work to improve!",
      2: "Thanks for your feedback. We'll do better!",
      3: "Thanks for your rating!",
      4: "Great! We're glad you're enjoying the app!",
      5: "Awesome! Thank you for your support!",
    };

    return rating > 0 ? messages[rating] : "Your feedback helps us improve!";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-300 ${
            Platform.OS === "ios" ? "pt-[10px]" : "pt-[30px]"
          }`}
        >
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={30} color="black" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center flex-1">
            Rate the App
          </Text>
          <View className="w-10" />
        </View>

        {submitted ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-xl font-semibold mb-4">Thank You!</Text>
            <Text className="text-gray-600 text-center mb-4">
              Your rating has been submitted successfully.
            </Text>
            <View className="flex-row mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <View key={star} className="p-2">
                  <Star
                    size={40}
                    color={star <= rating ? "#FFD700" : "#D1D5DB"}
                    fill={star <= rating ? "#FFD700" : "none"}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-xl font-semibold mb-6">
              Enjoying the app?
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              {renderFeedbackMessage()}
            </Text>
            <View className="flex-row mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  className="p-2"
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                >
                  <Star
                    size={40}
                    color={star <= rating ? "#FFD700" : "#D1D5DB"}
                    fill={star <= rating ? "#FFD700" : "none"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              className={`w-[80%] py-4 rounded-xl ${
                rating > 0 ? "bg-accent" : "bg-gray-300"
              }`}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text className="text-white text-center font-semibold">
                Submit Rating
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
