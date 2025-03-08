import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionButton from '@/components/QuickActionButton';

const { width } = Dimensions.get('window');

const Index = () => {
  const [studentLocation, setStudentLocation] = useState({
    status: 'In Transit',
    eta: '10 mins',
    location: 'On Main Street',
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#4a90e2", "#357abd"]} className="p-5 rounded-b-2xl">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-base opacity-90">Good Morning</Text>
              <Text className="text-white text-2xl font-bold">John's Parent</Text>
            </View>
            <TouchableOpacity className="p-2">
              <MaterialIcons name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Live Tracking Card */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Live Tracking</Text>
            <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-lg">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-green-600 text-sm font-medium">On Time</Text>
            </View>
          </View>
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="location-on" size={24} color="#4a90e2" />
              <Text className="ml-2 text-gray-600">Current Location</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={24} color="#4a90e2" />
              <Text className="ml-2 text-gray-600">ETA: 10 mins</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-blue-500 py-3 rounded-lg items-center">
            <Text className="text-white font-medium">View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <QuickActionButton icon={<Ionicons name="notifications-outline" size={24} color="white" />} label="Notifications" color="#FF9500" onPress={() => {}} />
            <QuickActionButton icon={<MaterialIcons name="event-busy" size={24} color="white" />} label="Report Absence" color="#FF3B30" onPress={() => {}} />
            <QuickActionButton icon={<FontAwesome5 name="route" size={24} color="white" />} label="View Route" color="#34C759" onPress={() => {}} />
            <QuickActionButton icon={<MaterialIcons name="history" size={24} color="white" />} label="Trip History" color="#5856D6" onPress={() => {}} />
          </View>
        </View>

        {/* Driver Info */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-4">Today's Driver</Text>
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20driver%20portrait&aspect=1:1' }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="text-gray-800 font-bold">Michael Johnson</Text>
              <Text className="text-gray-600 text-sm">License: DL123456</Text>
              <Text className="text-gray-600 text-sm">Vehicle: Toyota Hiace</Text>
            </View>
            <TouchableOpacity className="p-3 bg-gray-200 rounded-full">
              <MaterialIcons name="phone" size={24} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;