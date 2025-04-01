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
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionButton from '@/components/QuickActionButton';
import AbsenceReportModal from '@/components/AbsenceReportModal';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Index = () => {
  const [studentLocation, setStudentLocation] = useState({
    status: 'In Transit',
    eta: '10 mins',
    location: 'On Main Street',
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  // Mock data for students - in a real app, this would come from an API or database
  const students = [
    { id: '1', name: 'John Smith', grade: '10' },
    { id: '2', name: 'Sarah Smith', grade: '8' },
  ];

  const handleLogout = () => {
    // Add any logout logic here
    router.replace('/(auth)');
  };

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
            <View className="flex-row items-center">
              <TouchableOpacity 
                className="p-2 mr-2" 
                onPress={() => router.push('/notifications')}
              >
                <MaterialIcons name="notifications" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2" onPress={() => setShowProfileMenu(true)}>
                <MaterialIcons name="account-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Profile Menu Modal */}
        <Modal
          visible={showProfileMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowProfileMenu(false)}
        >
          <TouchableOpacity 
            className="flex-1 bg-black/50" 
            activeOpacity={1} 
            onPress={() => setShowProfileMenu(false)}
          >
            <View className="absolute right-4 top-16 bg-white rounded-lg shadow-lg w-48">
              <TouchableOpacity 
                className="flex-row items-center p-4 border-b border-gray-200"
                onPress={() => {
                  setShowProfileMenu(false);
                  // Add settings navigation logic here
                }}
              >
                <MaterialIcons name="settings" size={24} color="#4a90e2" />
                <Text className="ml-3 text-gray-800">Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center p-4"
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={24} color="#FF3B30" />
                <Text className="ml-3 text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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
          <TouchableOpacity 
            className="bg-blue-500 py-3 rounded-lg items-center"
            onPress={() => router.push('/map')}
          >
            <Text className="text-white font-medium">View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <QuickActionButton 
              icon={<MaterialIcons name="chat" size={24} color="white" />} 
              label="Chat" 
              color="#FF9500" 
              onPress={() => router.push('/chat')} 
            />
            <QuickActionButton 
              icon={<MaterialIcons name="event-busy" size={24} color="white" />} 
              label="Report Absence" 
              color="#FF3B30" 
              onPress={() => setShowAbsenceModal(true)} 
            />
            <QuickActionButton 
              icon={<FontAwesome5 name="route" size={24} color="white" />} 
              label="View Route" 
              color="#34C759" 
              onPress={() => router.push('/route')} 
            />
            <QuickActionButton 
              icon={<MaterialIcons name="history" size={24} color="white" />} 
              label="Trip History" 
              color="#5856D6" 
              onPress={() => {}} 
            />
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

      {/* Absence Report Modal */}
      <AbsenceReportModal
        visible={showAbsenceModal}
        onClose={() => setShowAbsenceModal(false)}
        students={students}
      />
    </SafeAreaView>
  );
};

export default Index;