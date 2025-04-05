import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const RouteScreen = () => {
  // Mock route data
  const routeInfo = {
    pickup: {
      time: '7:30 AM',
      location: 'Calle Principal #123, Santo Domingo',
      status: 'A Tiempo',
    },
    dropoff: {
      time: '8:15 AM',
      location: 'Escuela Santo Domingo',
      status: 'Programado',
    },
    stops: [
      {
        time: '7:30 AM',
        location: 'Calle Principal #123',
        type: 'Recogida',
        status: 'Completado',
      },
      {
        time: '7:45 AM',
        location: 'Calle Roble #456',
        type: 'Recogida',
        status: 'En Progreso',
      },
      {
        time: '8:00 AM',
        location: 'Calle Roble #456',
        type: 'Recogida',
        status: 'Pendiente',
      },
      {
        time: '8:15 AM',
        location: 'Escuela Santo Domingo',
        type: 'Entrega',
        status: 'Pendiente',
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Detalles de la Ruta</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Route Summary */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Resumen de la Ruta</Text>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600">Hora de Recogida</Text>
                <Text className="text-lg font-semibold">{routeInfo.pickup.time}</Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-600 font-medium">{routeInfo.pickup.status}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600">Hora de Entrega</Text>
                <Text className="text-lg font-semibold">{routeInfo.dropoff.time}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 font-medium">{routeInfo.dropoff.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stops */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Paradas</Text>
          <View className="space-y-4">
            {routeInfo.stops.map((stop, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <MaterialIcons
                    name={stop.type === 'Recogida' ? 'person-add' : 'school'}
                    size={20}
                    color="#4a90e2"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-semibold text-gray-800">{stop.location}</Text>
                      <Text className="text-sm text-gray-600">{stop.time}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${
                      stop.status === 'Completado' ? 'bg-green-100' :
                      stop.status === 'En Progreso' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <Text className={`text-sm font-medium ${
                        stop.status === 'Completado' ? 'text-green-600' :
                        stop.status === 'En Progreso' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {stop.status}
                      </Text>
                    </View>
                  </View>
                  {index < routeInfo.stops.length - 1 && (
                    <View className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RouteScreen; 