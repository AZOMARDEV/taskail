import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import {
  parsePhoneNumberFromString,
  AsYouType,
  getExampleNumber,
  CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import countries from "./countries";

const INITIAL_NUM_TO_RENDER = 50;
const ITEMS_PER_BATCH = 30;
const ITEM_HEIGHT = 64;

const CountryItem = React.memo(
  ({
    item,
    onSelect,
  }: {
    item: { code: string; name: string; flag: string; dialCode: string };
    onSelect: (item: {
      code: string;
      name: string;
      flag: string;
      dialCode: string;
    }) => void;
  }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => onSelect(item)}
    >
      <Text className="text-xl mr-3">{item.flag}</Text>
      <Text className="flex-1">{item.name}</Text>
      <Text className="text-gray-500">{item.dialCode}</Text>
    </TouchableOpacity>
  )
);

export const PhoneVerification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email, password, username } = params as {
    email: string;
    password: string;
    username: string;
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exampleNumber, setExampleNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.back(); // Change this from router.back()
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);
  
  useEffect(() => {
    const example = getExampleNumber(
      selectedCountry.code as CountryCode,
      examples
    );
    if (example) {
      setExampleNumber(example.formatNational());
    }
    setPhoneNumber("");
    setFormattedNumber("");
  }, [selectedCountry]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(countries);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
    );
    setFilteredCountries(filtered);
  }, [searchQuery]);

  const keyExtractor = React.useCallback((item: any) => item.code, []);

  const getItemLayout = React.useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const handlePhoneNumberChange = (text: string) => {
    const numericOnly = text.replace(/\D/g, "");
    const asYouType = new AsYouType(selectedCountry.code as CountryCode);
    const formatted = asYouType.input(numericOnly);

    setPhoneNumber(numericOnly);
    setFormattedNumber(formatted);
  };

  const handleContinue = () => {
    const phoneNumberWithCode = `${selectedCountry.dialCode}${phoneNumber}`;
    const parsedNumber = parsePhoneNumberFromString(
      phoneNumberWithCode,
      selectedCountry.code as CountryCode
    );

    if (!parsedNumber?.isValid()) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid phone number",
        position: "bottom",
      });
      return;
    }

    router.push({
      pathname: "/auth/reset-password-code",
      params: {
        phoneNumber: parsedNumber.formatInternational(),
        email,
        password,
        username,
      },
    });
  };

  const handleCountrySelect = React.useCallback((country: any) => {
    setSelectedCountry(country);
    setIsModalVisible(false);
    setSearchQuery("");
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white">
        <Animated.View
          className="flex-1"
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(300)}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 28,
              paddingTop: Platform.select({ ios: 100, android: 30 }),
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5E5",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 bg-white rounded-full h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold mr-8 text-center flex-1">
              Verification
            </Text>
          </View>

          <View className="px-6 flex-1">
            <Text className="text-gray-500 mb-8">
              Enter your phone number, we will send an authentication code
            </Text>

            <View className="mb-2">
              <Text className="text-sm text-gray-500">
                Example: {exampleNumber}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 rounded-xl mb-8">
              <TouchableOpacity
                className="px-4 py-4 border-r border-gray-200 flex-row items-center"
                onPress={() => setIsModalVisible(true)}
              >
                <Text className="text-xl mr-2">{selectedCountry.flag}</Text>
                <Text>{selectedCountry.dialCode}</Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="gray"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              <TextInput
                className="flex-1 px-4 py-4"
                placeholder="Type your phone number"
                keyboardType="phone-pad"
                value={formattedNumber}
                onChangeText={handlePhoneNumberChange}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className={`bg-accent rounded-full py-4 items-center mt-14 ${
                phoneNumber.length >= 4 ? "bg-accent" : "bg-gray-300"
              }`}
              onPress={handleContinue}
              disabled={phoneNumber.length < 4}
            >
              <Text className="text-white font-medium">Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={false}
          presentationStyle="pageSheet"
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-xl font-bold">Select Country</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="px-4 py-2 border-b border-gray-200">
              <View className="flex-row items-center bg-gray-100 px-4 py-2 rounded-lg">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                  className="flex-1 ml-2"
                  placeholder="Search country or code"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <FlatList
              data={filteredCountries}
              renderItem={({ item }) => (
                <CountryItem item={item} onSelect={handleCountrySelect} />
              )}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              initialNumToRender={INITIAL_NUM_TO_RENDER}
              maxToRenderPerBatch={ITEMS_PER_BATCH}
              windowSize={5}
              removeClippedSubviews={Platform.OS === "android"}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          </SafeAreaView>
        </Modal>
        <Toast />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PhoneVerification;
