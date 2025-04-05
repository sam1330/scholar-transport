import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'arrival' | 'delay' | 'absence' | 'general' | 'problem';
  driver?: string;
  vehicle?: string;
}

const NotificationItem = ({ notification, onPress }: { notification: Notification; onPress: () => void }) => {
  const getIconColor = () => {
    switch (notification.type) {
      case 'arrival':
        return '#34C759';
      case 'delay':
        return '#FF9500';
      case 'absence':
        return '#FF3B30';
      case 'problem':
        return '#FF3B30';
      default:
        return '#4a90e2';
    }
  };

  const getIconName = () => {
    switch (notification.type) {
      case 'arrival':
        return 'check-circle';
      case 'delay':
        return 'schedule';
      case 'absence':
        return 'cancel';
      case 'problem':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 border-b border-gray-200 ${!notification.read ? 'bg-blue-50' : ''}`}
    >
      <View className="flex-row items-start">
        <MaterialIcons name={getIconName()} size={24} color={getIconColor()} />
        <View className="flex-1 ml-3">
          <Text className="text-gray-800 font-medium">{notification.title}</Text>
          <Text className="text-gray-600 mt-1">{notification.message}</Text>
          {notification.type === 'problem' && (
            <View className="mt-2 bg-red-50 p-2 rounded-lg">
              <Text className="text-red-600 text-sm">
                Conductor: {notification.driver}
              </Text>
              <Text className="text-red-600 text-sm">
                Vehículo: {notification.vehicle}
              </Text>
            </View>
          )}
          <Text className="text-gray-400 text-sm mt-2">{notification.timestamp}</Text>
        </View>
        {!notification.read && (
          <View className="w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Llegada a la Escuela',
      message: 'El autobús ha llegado a la escuela',
      timestamp: '8:30 AM',
      read: false,
      type: 'arrival',
    },
    {
      id: '2',
      title: 'Retraso en la Ruta',
      message: 'El autobús llegará 15 minutos tarde debido al tráfico',
      timestamp: '8:15 AM',
      read: true,
      type: 'delay',
    },
    {
      id: '3',
      title: 'Reporte de Ausencia',
      message: 'John no asistirá hoy',
      timestamp: '7:45 AM',
      read: true,
      type: 'absence',
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('parent_notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (id: string) => {
    try {
      const updatedNotifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      await AsyncStorage.setItem('parent_notifications', JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Notificaciones</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => markAsRead(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <MaterialIcons name="notifications-none" size={48} color="#ccc" />
            <Text className="text-gray-500 mt-2">No hay notificaciones</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen; 