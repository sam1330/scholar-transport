import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Mock data for travel history
const travelHistory = [
  {
    id: '1',
    date: '2024-03-15',
    status: 'Completado',
    pickupTime: '7:30 AM',
    dropoffTime: '8:15 AM',
    driver: 'Samuel Martínez',
    vehicle: 'Toyota Hiace',
    notes: 'Viaje sin incidentes',
  },
  {
    id: '2',
    date: '2024-03-14',
    status: 'Completado',
    pickupTime: '7:45 AM',
    dropoffTime: '8:30 AM',
    driver: 'Samuel Martínez',
    vehicle: 'Toyota Hiace',
    notes: 'Llegada a tiempo',
  },
  {
    id: '3',
    date: '2024-03-13',
    status: 'Completado',
    pickupTime: '7:35 AM',
    dropoffTime: '8:20 AM',
    driver: 'Samuel Martínez',
    vehicle: 'Toyota Hiace',
    notes: 'Tráfico moderado',
  },
];

const TravelHistoryScreen = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white p-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Historial de Viajes</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Travel History List */}
        <View className="p-4">
          {travelHistory.map((trip) => (
            <View
              key={trip.id}
              className="bg-white p-4 rounded-xl mb-4 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-gray-800">
                  {formatDate(trip.date)}
                </Text>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-600 text-sm">{trip.status}</Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row items-center">
                  <MaterialIcons name="access-time" size={20} color="#4a90e2" />
                  <Text className="ml-2 text-gray-600">
                    Recogida: {trip.pickupTime}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="access-time" size={20} color="#4a90e2" />
                  <Text className="ml-2 text-gray-600">
                    Entrega: {trip.dropoffTime}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="person" size={20} color="#4a90e2" />
                  <Text className="ml-2 text-gray-600">
                    Conductor: {trip.driver}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="directions-bus" size={20} color="#4a90e2" />
                  <Text className="ml-2 text-gray-600">
                    Vehículo: {trip.vehicle}
                  </Text>
                </View>
                {trip.notes && (
                  <View className="flex-row items-center">
                    <MaterialIcons name="note" size={20} color="#4a90e2" />
                    <Text className="ml-2 text-gray-600">{trip.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TravelHistoryScreen; 