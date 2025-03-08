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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import StudentCard from "@/components/StudentCard";
import QuickActionButton from "@/components/QuickActionButton";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const DriverDashboard = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isTripActive, setIsTripActive] = useState(false);

  const [students, setStudents] = useState([
    {
      id: "1",
      name: "Juan Perez",
      address: "Calle francisco Javier",
      coordinates: { latitude: 18.49314601243193, longitude: -69.74738174232722 },
      distance: 2.5,
      status: "waiting",
      pickupTime: "7:45 AM",
    },
    {
      id: "2",
      name: "Mario Rodriguez",
      address: "Calle A. #22 Res. Nuevo amanecer",
      coordinates: { latitude: 18.490347582369107, longitude: -69.80865863031364 },
      distance: 1.8,
      status: "waiting",
      pickupTime: "7:55 AM",
    },
    {
      id: "3",
      name: "Maria Gomez",
      address: "Calle Claudio Peña #15",
      coordinates: { latitude: 18.486849365677216, longitude: -69.83232845140589 },
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
    status: "Not Started",
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
  const startTrip = () => {
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
        status: "In Progress",
        startTime: new Date(),
        nextStop: sortedStudents[0]?.address || "No hay paradas restantes",
        studentsPickedUp: students.filter((s) => s.status === "picked_up").length,
      }));
  };

  const endTrip = () => {
    Alert.alert("Terminar viaje", "¿Estás seguro de que deseas terminar el viaje?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Terminar",
        onPress: () => {
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
        },
      },
    ]);
  };

  const markStudentAsPickedUp = (studentId: string) => {
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

          <View style={styles.weatherWidget}>
            <Ionicons name="sunny" size={24} color="#FFF" />
            <Text style={styles.weatherText}>
              {weatherInfo.temperature} • {weatherInfo.condition}
            </Text>
          </View>
        </LinearGradient>

        {/* Trip Status Section */}
        <View style={styles.tripStatus}>
          <Text style={styles.sectionTitle}>Status del viaje</Text>
          <View style={styles.tripStatsContainer}>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>
                {currentTrip.studentsPickedUp}
              </Text>
              <Text style={styles.statLabel}>Recogido</Text>
            </View>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>
                {students.filter((s) => s.status === "waiting").length}
              </Text>
              <Text style={styles.statLabel}>Restante</Text>
            </View>
            <View style={styles.tripStat}>
              <Text style={styles.statNumber}>{students.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
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
              icon={<MaterialIcons name="message" size={24} color="#FFF" />}
              label="Chat"
              color="#FF9800"
              onPress={() => {}}
            />
            <QuickActionButton
              icon={<MaterialIcons name="warning" size={24} color="#FFF" />}
              label="Reportar Problema"
              color="#F44336"
              onPress={() => {}}
            />
            <QuickActionButton
              icon={<MaterialIcons name="people" size={24} color="#FFF" />}
              label="Ver estudiantes"
              color="#2196F3"
              onPress={() => {router.push("/(driver)/StudentList")}}
            />
          </View>
        </View>

        {/* Student List */}
        {isTripActive && (
          <View style={styles.studentList}>
            <Text style={styles.sectionTitle}>Ruta Actual</Text>
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
  weatherWidget: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  weatherText: {
    color: "#FFF",
    marginLeft: 8,
    fontSize: 16,
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
