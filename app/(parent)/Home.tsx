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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface IQuickActionButton {
  label: string;
  color: string;
  onPress: () => void;
  icon: React.ReactNode;
}

const Home = () => {
  const [studentLocation, setStudentLocation] = useState({
    status: 'In Transit',
    eta: '10 mins',
    location: 'On Main Street',
  });

  const QuickActionButton = ({ icon, label, color, onPress }: IQuickActionButton) => (
    <TouchableOpacity 
      style={[styles.quickActionBtn, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#4a90e2', '#357abd']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Good Morning</Text>
              <Text style={styles.nameText}>John's Parent</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <MaterialIcons name="account-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Live Tracking Card */}
        <View style={styles.trackingCard}>
          <View style={styles.trackingHeader}>
            <Text style={styles.trackingTitle}>Live Tracking</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{studentLocation.status}</Text>
            </View>
          </View>
          
          <View style={styles.trackingInfo}>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={24} color="#4a90e2" />
              <Text style={styles.infoText}>{studentLocation.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={24} color="#4a90e2" />
              <Text style={styles.infoText}>ETA: {studentLocation.eta}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewMapButton}>
            <Text style={styles.viewMapText}>View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              icon={<Ionicons name="notifications-outline" size={24} color="white" />}
              label="Notifications"
              color="#FF9500"
              onPress={() => {}}
            />
            <QuickActionButton
              icon={<MaterialIcons name="event-busy" size={24} color="white" />}
              label="Report Absence"
              color="#FF3B30"
              onPress={() => {}}
            />
            <QuickActionButton
              icon={<FontAwesome5 name="route" size={24} color="white" />}
              label="View Route"
              color="#34C759"
              onPress={() => {}}
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
        <View style={styles.driverCard}>
          <Text style={styles.sectionTitle}>Today's Driver</Text>
          <View style={styles.driverInfo}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=professional%20driver%20portrait&aspect=1:1' }}
              style={styles.driverImage}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Michael Johnson</Text>
              <Text style={styles.driverSubText}>License: DL123456</Text>
              <Text style={styles.driverSubText}>Vehicle: Toyota Hiace</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <MaterialIcons name="phone" size={24} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  trackingCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  trackingInfo: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  viewMapButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewMapText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  quickActionText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  driverCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
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
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  driverSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  callButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
});

export default Home;