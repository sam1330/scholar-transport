import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface SettingOption {
  title: string;
  icon: MaterialIconName;
  onPress: () => void;
  color?: string;
}

const Settings = () => {
  const settingsOptions: SettingOption[] = [
    {
      title: 'Account',
      icon: 'account-circle',
      onPress: () => {},
    },
    {
      title: 'Notifications',
      icon: 'notifications-none',
      onPress: () => {},
    },
    {
      title: 'Privacy',
      icon: 'lock-outline',
      onPress: () => {},
    },
    {
      title: 'Help & Support',
      icon: 'help-outline',
      onPress: () => {},
    },
    {
      title: 'About',
      icon: 'info-outline',
      onPress: () => {},
    },
    {
      title: 'Logout',
      icon: 'logout',
      onPress: () => router.replace('/(auth)'),
      color: '#FF3B30',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Settings</Text>
          <View className="bg-white rounded-xl shadow-sm">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.title}
                onPress={option.onPress}
                className={`flex-row items-center p-4 ${
                  index !== settingsOptions.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <MaterialIcons
                  name={option.icon}
                  size={24}
                  color={option.color || '#4a90e2'}
                />
                <Text
                  className={`ml-3 text-base ${
                    option.color ? 'text-red-500' : 'text-gray-800'
                  }`}
                >
                  {option.title}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#9CA3AF"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings; 