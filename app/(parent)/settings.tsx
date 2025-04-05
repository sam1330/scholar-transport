import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => router.replace('/(auth)'),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Configuración</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Notifications Section */}
        <View className="bg-white mt-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Notificaciones</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons name="notifications" size={24} color="#4a90e2" />
              <Text className="ml-3 text-gray-800">Notificaciones Push</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#4a90e2' }}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View className="bg-white mt-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Privacidad</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={24} color="#4a90e2" />
              <Text className="ml-3 text-gray-800">Seguimiento de Ubicación</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: '#767577', true: '#4a90e2' }}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View className="bg-white mt-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Apariencia</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <View className="flex-row items-center">
              <MaterialIcons name="dark-mode" size={24} color="#4a90e2" />
              <Text className="ml-3 text-gray-800">Modo Oscuro</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#4a90e2' }}
            />
          </View>
        </View>

        {/* Account Section */}
        <View className="bg-white mt-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Cuenta</Text>
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto.')}
          >
            <MaterialIcons name="person" size={24} color="#4a90e2" />
            <Text className="ml-3 text-gray-800">Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-200"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto.')}
          >
            <MaterialIcons name="security" size={24} color="#4a90e2" />
            <Text className="ml-3 text-gray-800">Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 mx-4 my-8 p-4 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold">Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen; 