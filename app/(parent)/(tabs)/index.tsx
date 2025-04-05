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
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickActionButton from '@/components/QuickActionButton';
import AbsenceReportModal from '@/components/AbsenceReportModal';
import ParentHeader from '@/components/ParentHeader';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Index = () => {
  const [studentLocation, setStudentLocation] = useState({
    status: 'En transito',
    eta: '10 mins',
    location: 'En la calle principal',
  });
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  // Mock data for students - in a real app, this would come from an API or database
  const students = [
    { id: '1', name: 'Juan Pérez', grade: '10' },
    { id: '2', name: 'Ana García', grade: '8' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ParentHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Live Tracking Card */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-lg">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Seguimiento en vivo</Text>
            <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-lg">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-green-600 text-sm font-medium">A tiempo</Text>
            </View>
          </View>
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="location-on" size={24} color="#4a90e2" />
              <Text className="ml-2 text-gray-600">Ubicación actual</Text>
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
            <Text className="text-white font-medium">Ver en mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Acciones rápidas</Text>
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
          <Text className="text-lg font-bold text-gray-800 mb-4">Conductor de hoy</Text>
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20driver%20portrait&aspect=1:1' }}
              className="w-16 h-16 rounded-full"
            />
            <View className="ml-4 flex-1">
              <Text className="text-gray-800 font-bold">Samuel Martinez</Text>
              <Text className="text-gray-600 text-sm">Licencia: DL123456</Text>
              <Text className="text-gray-600 text-sm">Vehículo: Toyota Hiace</Text>
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