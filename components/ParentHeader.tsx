import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const ParentHeader = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    // Add any logout logic here
    router.replace('/(auth)');
  };

  return (
    <>
      <LinearGradient colors={["#4a90e2", "#357abd"]} className="p-5 rounded-b-2xl">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-base opacity-90">Good Morning</Text>
            <Text className="text-white text-2xl font-bold">John's Parent</Text>
          </View>
          <TouchableOpacity className="p-2" onPress={() => setShowProfileMenu(true)}>
            <MaterialIcons name="account-circle" size={40} color="white" />
          </TouchableOpacity>
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
                router.push('/settings');
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
    </>
  );
};

export default ParentHeader; 