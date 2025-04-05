import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
  Platform,
  Linking,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import StudentCard from "@/components/StudentCard";
import QuickActionButton from "@/components/QuickActionButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { sendDropoffNotification, sendProblemNotification } from '@/utils/notifications';

const { width } = Dimensions.get("window");

const DriverDashboard = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isTripActive, setIsTripActive] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [students, setStudents] = useState([
    {
      id: "1",
      name: "Juan Perez",
      address: "Calle francisco Javier",
      coordinates: {
        latitude: 18.49314601243193,
        longitude: -69.74738174232722,
      },
      distance: 2.5,
      status: "waiting",
      pickupTime: "7:45 AM",
    },
    {
      id: "2",
      name: "Mario Rodriguez",
      address: "Calle A. #22 Res. Nuevo amanecer",
      coordinates: {
        latitude: 18.490347582369107,
        longitude: -69.80865863031364,
      },
      distance: 1.8,
      status: "waiting",
      pickupTime: "7:55 AM",
    },
    {
      id: "3",
      name: "Maria Gomez",
      address: "Calle Claudio Peña #15",
      coordinates: {
        latitude: 18.486849365677216,
        longitude: -69.83232845140589,
      },
      distance: 3.2,
      status: "waiting",
      pickupTime: "8:05 AM",
    },
  ]);

  const [currentTrip, setCurrentTrip] = useState<{
    status: string;
    studentsPickedUp: number;
    totalStudents: number;
    nextStop: string;
    estimatedTime: string;
    startTime: Date | null;
    endTime: Date | null;
  }>({
    status: "No Iniciado",
    studentsPickedUp: 0,
    totalStudents: 3,
    nextStop: "",
    estimatedTime: "",
    startTime: null,
    endTime: null,
  });

  const [weatherInfo] = useState({
    temperature: "24°C",
    condition: "Soleado",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [problem, setProblem] = useState("");

  const [errors, setErrors] = useState([]);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  const handleReport = async () => {
    if (!problem.trim()) return alert("Por favor describe el problema.");

    try {
      // Create notification for parents
      // const notification = {
      //   id: Date.now().toString(),
      //   title: 'Problema Reportado por el Conductor',
      //   message: problem,
      //   timestamp: new Date().toLocaleString(),
      //   read: false,
      //   type: 'problem' as const,
      //   driver: 'Samuel Martinez',
      //   vehicle: 'Toyota Hiace',
      // };

      // // Get existing notifications
      // const existingNotifications = await AsyncStorage.getItem('parent_notifications');
      // const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      // // Add new notification
      // notifications.unshift(notification);
      
      // // Save updated notifications
      // await AsyncStorage.setItem('parent_notifications', JSON.stringify(notifications));

      // // Also save to alerts for driver's view
      // const prevAlerts = JSON.parse(await AsyncStorage.getItem("alerts") || "[]");
      // await AsyncStorage.setItem("alerts", JSON.stringify([problem, ...prevAlerts]));

      // Send notification for the reported problem
      await sendProblemNotification(
        problem,
        "Samuel Martínez",
        "Toyota Hiace"
      );

      // Show success message
      alert("Problema reportado exitosamente");
      setProblem("");
      setModalVisible(false);
    } catch (error) {
      console.error('Error reporting problem:', error);
      alert('Error al reportar el problema. Por favor intenta de nuevo.');
    }
  };

  useEffect(() => {
    (async () =>
      await AsyncStorage.getItem("alerts").then((alerts) =>
        setErrors(JSON.parse(alerts || "[]"))
      ))();
  }, []);

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required for trip tracking.');
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          async (newLocation) => {
            setLocation(newLocation);
            // Store location for parent app to access
            await AsyncStorage.setItem('driver_location', JSON.stringify({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: new Date().toLocaleString(),
            }));
          }
        );

        setLocationSubscription(subscription);
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };

    if (isTripActive) {
      startLocationTracking();
    } else if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isTripActive]);

  const startTrip = async () => {
    if (!isOnDuty) {
      Alert.alert(
        "Advertencia",
        "Para iniciar un viaje, debes estar en servicio."
      );
      return;
    }

    // Sort students by distance and only include waiting students
    const sortedStudents = [...students]
      .filter((student) => student.status === "waiting")
      .sort((a, b) => a.distance - b.distance);

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        status: student.status === "picked_up" ? "picked_up" : "waiting",
      }))
    );

    setIsTripActive(true);
    setCurrentTrip((prev) => ({
      ...prev,
      status: "En Progreso",
      startTime: new Date(),
      nextStop: sortedStudents[0]?.address || "No hay paradas restantes",
      studentsPickedUp: students.filter((s) => s.status === "picked_up").length,
    }));
  };

  const endTrip = () => {
    Alert.alert(
      "Terminar viaje",
      "¿Estás seguro de que deseas terminar el viaje?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Terminar",
          onPress: async () => {
            setIsTripActive(false);
            setCurrentTrip({
              status: "No Iniciado",
              studentsPickedUp: 0,
              totalStudents: students.length,
              nextStop: "",
              estimatedTime: "",
              startTime: null,
              endTime: new Date(),
            });
            // Reset all students for next trip
            setStudents((prev) =>
              prev.map((student) => ({
                ...student,
                status: "waiting",
              }))
            );
            // Clear stored location when trip ends
            await AsyncStorage.removeItem('driver_location');
          },
        },
      ]
    );
  };

  const markStudentAsPickedUp = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status: "picked_up" } : student
      )
    );

    setCurrentTrip((prev) => ({
      ...prev,
      studentsPickedUp: prev.studentsPickedUp + 1,
      nextStop:
        students.find((s) => s.status === "waiting" && s.id !== studentId)
          ?.address || "School",
    }));

    // Send notification when student is picked up
    await sendDropoffNotification(
      student.name,
      "Samuel Martínez",
      "Toyota Hiace"
    );
  };

  const handleLogout = () => {
    // Add any logout logic here
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient colors={["#4a90e2", "#357abd"]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Bienvenido de vuelta</Text>
              <Text style={styles.driverName}>Samuel Martinez</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowProfileMenu(true)}
              style={styles.profileButton}
            >
              <MaterialIcons name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.weatherWidget}>
              <Ionicons name="sunny" size={24} color="#FFF" />
              <Text style={styles.weatherText}>
                {weatherInfo.temperature} • {weatherInfo.condition}
              </Text>
            </View>
            <View style={styles.dutySwitch}>
              <Text style={styles.dutyText}>
                {isOnDuty ? "En servicio" : "Fuera de servicio"}
              </Text>
              <Switch
                value={isOnDuty}
                onValueChange={setIsOnDuty}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isOnDuty ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
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

        {/* Trip Status Section */}
        <View style={styles.tripStatus}>
          <Text style={styles.sectionTitle}>Estado del viaje</Text>
          <View style={styles.tripStatsContainer}>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>
                {currentTrip.studentsPickedUp}
              </Text>
              <Text style={styles.statLabel}>Recogidos</Text>
            </View>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>
                {students.filter((s) => s.status === "waiting").length}
              </Text>
              <Text style={styles.statLabel}>Restantes</Text>
            </View>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>{students.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.actionGrid}>
            <QuickActionButton
              icon={
                <MaterialIcons name="directions-bus" size={24} color="#FFF" />
              }
              label={isTripActive ? "Terminar Viaje" : "Iniciar Viaje"}
              color={isTripActive ? "#F44336" : "#4CAF50"}
              onPress={isTripActive ? endTrip : startTrip}
              disabled={!isOnDuty}
            />
            <QuickActionButton
              icon={<MaterialIcons name="chat" size={24} color="#FFF" />}
              label="Chat"
              color="#FF9800"
              onPress={() => router.push("/(driver)/chat")}
            />
            <QuickActionButton
              icon={<MaterialIcons name="warning" size={24} color="#FFF" />}
              label="Reportar Problema"
              color="#F44336"
              onPress={() => setModalVisible(true)}
            />
            <QuickActionButton
              icon={<MaterialIcons name="people" size={24} color="#FFF" />}
              label="Ver estudiantes"
              color="#2196F3"
              onPress={() => {
                router.push("/(driver)/StudentList");
              }}
            />
          </View>
        </View>

        {/* Student List */}
        {isTripActive && (
          <View style={styles.studentList}>
            <Text style={styles.sectionTitle}>Ruta actual</Text>
            {students
              .filter((student) => student.status === "waiting")
              .map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  markStudentAsPickedUp={markStudentAsPickedUp}
                  isTripActive
                />
              ))}
          </View>
        )}

        {/* Completed Pickups */}
        {isTripActive && currentTrip.studentsPickedUp > 0 && (
          <View style={styles.completedPickups}>
            <Text style={styles.sectionTitle}>Recogidos</Text>
            {students
              .filter((student) => student.status === "picked_up")
              .map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  markStudentAsPickedUp={markStudentAsPickedUp}
                  isTripActive
                />
              ))}
          </View>
        )}

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 p-5 rounded-xl shadow-lg">
              <Text className="text-lg font-bold text-gray-800">
                Reportar un Problema
              </Text>

              {/* Input */}
              <TextInput
                className="border border-gray-300 p-3 rounded-md mt-4"
                placeholder="Describe el problema..."
                multiline
                value={problem}
                onChangeText={setProblem}
              />

              {/* Buttons */}
              <View className="flex-row justify-end mt-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
                >
                  <Text className="text-gray-700">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReport}
                  className="px-4 py-2 bg-blue-500 rounded-md"
                >
                  <Text className="text-white font-semibold">Reportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "#FFF",
    fontSize: 16,
    opacity: 0.9,
  },
  driverName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  dutySwitch: {
    flexDirection: "row",
    alignItems: "center",
  },
  dutyText: {
    color: "#FFF",
    marginRight: 8,
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  weatherWidget: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  weatherText: {
    color: "#FFF",
    marginLeft: 8,
    fontSize: 16,
  },
  profileButton: {
    padding: 8,
  },
  tripStatus: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  tripStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tripStat: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  statLabel: {
    color: "#666",
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  disabledButton: {
    opacity: 0.5,
  },
  quickActionText: {
    color: "#FFF",
    marginTop: 8,
    fontWeight: "600",
  },
  studentList: {
    padding: 20,
  },
  completedPickups: {
    padding: 20,
    paddingTop: 0,
  },
  studentCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  studentAddress: {
    color: "#666",
    marginTop: 4,
  },
  studentDistance: {
    color: "#4a90e2",
    marginTop: 4,
    fontSize: 12,
  },
  studentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickupButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  navigationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
});

export default DriverDashboard;
