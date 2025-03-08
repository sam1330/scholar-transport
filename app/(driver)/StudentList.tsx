import Input from "@/components/Input";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const students = [
  {
    id: 1,
    name: "John Doe",
    parents: "Jane Doe",
    address: "123 Main St",
    route: "Route 1",
    school: "School A",
  },
  {
    id: 2,
    name: "Jane Smith",
    parents: "John Smith",
    address: "456 Oak St",
    route: "Route 2",
    school: "School B",
  },
];

const StudentsList = () => {
  const [filters, setFilters] = React.useState({
    fullName: "",
  });
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
                Samuel Martinez
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <MaterialIcons name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Filter by name */}
        <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-2">Filtrar</Text>
          <Input
            placeholder="Nombre Del Estudiante"
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

              {/* Información del estudiante */}
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
