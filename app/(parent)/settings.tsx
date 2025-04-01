import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [location, setLocation] = React.useState(true);

  const handleLogout = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Settings</Text>
      </View>

      <View className="p-4">
        {/* Profile Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-500 mb-2">PROFILE</Text>
          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons name="person" size={24} color="#4a90e2" />
            <Text className="ml-3 text-gray-800">Edit Profile</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#9CA3AF"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-500 mb-2">PREFERENCES</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <MaterialIcons name="notifications" size={24} color="#4a90e2" />
              <Text className="ml-3 text-gray-800">Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notifications ? '#4a90e2' : '#9CA3AF'}
            />
          </View>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={24} color="#4a90e2" />
              <Text className="ml-3 text-gray-800">Location Services</Text>
            </View>
            <Switch
              value={location}
              onValueChange={setLocation}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={location ? '#4a90e2' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-500 mb-2">SUPPORT</Text>
          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons name="help" size={24} color="#4a90e2" />
            <Text className="ml-3 text-gray-800">Help & Support</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#9CA3AF"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons name="privacy-tip" size={24} color="#4a90e2" />
            <Text className="ml-3 text-gray-800">Privacy Policy</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#9CA3AF"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View>
          <Text className="text-sm font-medium text-gray-500 mb-2">ACCOUNT</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-3"
          >
            <MaterialIcons name="logout" size={24} color="#FF3B30" />
            <Text className="ml-3 text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen; 