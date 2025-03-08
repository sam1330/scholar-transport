import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View, Linking, Alert, TouchableOpacity } from "react-native";

interface IStudentCardProps {
    student: IStudent;
    markStudentAsPickedUp: (id: string) => void;
    isTripActive: boolean;
}

interface IStudent {
    id: string;
    name: string;
    address: string;
    coordinates: { latitude: number; longitude: number };
    distance: number;
    status: string;
    pickupTime: string;
}

// Student card prop object:
// {
//     id: '1',
//     name: 'Emma Thompson',
//     address: '123 Oak Street',
//     coordinates: { latitude: 40.7128, longitude: -74.0060 },
//     distance: 2.5,
//     status: 'waiting',
//     pickupTime: '7:45 AM',
//   },

const StudentCard = ({student, markStudentAsPickedUp, isTripActive} : IStudentCardProps) => {
  const openMapsNavigation = (address: string, coordinates: { latitude: number; longitude: number }) => {
    Alert.alert("Navigation", "Choose your preferred navigation app", [
      {
        text: "Google Maps",
        onPress: () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
          Linking.openURL(url);
        },
      },
      {
        text: "Waze",
        onPress: () => {
          const url = `https://waze.com/ul?ll=${coordinates.latitude},${coordinates.longitude}&navigate=yes`;
          Linking.openURL(url);
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <FontAwesome5 name="user-graduate" size={24} color="#4a90e2" />
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentAddress}>{student.address}</Text>
          <Text style={styles.studentDistance}>{student.distance.toFixed(1)} km away</Text>
        </View>
      </View>
      <View style={styles.studentActions}>
        {student.status === 'waiting' && isTripActive && (
          <TouchableOpacity
            style={styles.pickupButton}
            onPress={() => markStudentAsPickedUp(student.id)}
          >
            <MaterialIcons name="check" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => openMapsNavigation(student.address, student.coordinates)}
        >
          <MaterialIcons name="directions" size={24} color="#4a90e2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    studentCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
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
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      studentDetails: {
        marginLeft: 12,
        flex: 1,
      },
      studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      studentAddress: {
        color: '#666',
        marginTop: 4,
      },
      studentDistance: {
        color: '#4a90e2',
        marginTop: 4,
        fontSize: 12,
      },
      studentActions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      pickupButton: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
      },
      navigationButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
      },
});

export default StudentCard;
