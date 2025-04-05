import Input from "@/components/Input";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const students = [
  {
    id: 1,
    name: "Juan Pérez",
    parents: "María Pérez",
    address: "Calle Principal #123",
    route: "Ruta 1",
    school: "Escuela A",
  },
  {
    id: 2,
    name: "Ana García",
    parents: "Carlos García",
    address: "Calle Roble #456",
    route: "Ruta 2",
    school: "Escuela B",
  },
];

const StudentsList = () => {
  const [filters, setFilters] = React.useState({
    fullName: "",
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    // Add any logout logic here
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={["#4a90e2", "#357abd"]}
          className="p-5 rounded-b-2xl"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-base opacity-90">
                Estudiantes
              </Text>
              <Text className="text-white text-2xl font-bold">
                Samuel Martínez
              </Text>
            </View>
            <TouchableOpacity 
              className="p-2"
              onPress={() => setShowProfileMenu(true)}
            >
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
                <Text className="ml-3 text-gray-800">Configuración</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center p-4"
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={24} color="#FF3B30" />
                <Text className="ml-3 text-red-500">Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Filter by name */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-2">Filtrar</Text>
          <Input
            placeholder="Nombre del estudiante"
            value={filters.fullName}
            onChangeText={(text) => setFilters({ fullName: text })}
            icon={
              <MaterialIcons
                name="search"
                size={20}
                color="#666"
                className="mr-2"
              />
            }
          />
        </View>

        {/* Lista de estudiantes */}
        <View className="p-5">
          {students.filter((student) => student.name.includes(filters.fullName)).map((student) => (
            <View
              key={student.id}
              className="bg-white p-4 rounded-xl mb-3 shadow-md flex-row items-center"
            >
              <FontAwesome5 name="user-graduate" size={28} color="#4a90e2" />

              {/* Información del estudiante */}
              <View className="flex-1">
                <View className="ml-4 d-block">
                  <Text className="text-xl font-bold text-gray-900">
                    {student.name}
                  </Text>
                </View>
                <View className="ml-4 flex-row flex-wrap">
                  <Text className="text-gray-700 text-sm mt-1">
                    <Text className="font-semibold text-gray-900">Padres:</Text>{" "}
                    {student.parents}
                  </Text>
                  <Text className="text-gray-700 text-sm mt-1 ml-3">
                    <Text className="font-semibold text-gray-900">
                      Dirección:
                    </Text>{" "}
                    {student.address}
                  </Text>
                  <Text className="text-gray-700 text-sm mt-1">
                    <Text className="font-semibold text-gray-900">
                      Escuela:
                    </Text>{" "}
                    {student.school}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentsList;
