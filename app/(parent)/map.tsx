import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface DriverInfo {
  name: string;
  vehicleInfo: string;
  status: string;
  eta: string;
}

const MapScreen = () => {
  const [driverLocation, setDriverLocation] = useState<Location>({
    latitude: 18.49314601243193,
    longitude: -69.74738174232722,
    timestamp: new Date().toLocaleString(),
  });

  const [driverInfo, setDriverInfo] = useState<DriverInfo>({
    name: 'Samuel Martinez',
    vehicleInfo: 'Toyota Hiace',
    status: 'En Tránsito',
    eta: '10 mins',
  });

  useEffect(() => {
    const loadDriverLocation = async () => {
      try {
        const locationData = await AsyncStorage.getItem('driver_location');
        if (locationData) {
          setDriverLocation(JSON.parse(locationData));
        }
      } catch (error) {
        console.error('Error loading driver location:', error);
      }
    };

    loadDriverLocation();
    // Poll for location updates every 10 seconds
    const interval = setInterval(loadDriverLocation, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguimiento en Vivo</Text>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
          }}
          title={driverInfo.name}
          description={driverInfo.vehicleInfo}
        >
          <View style={styles.markerContainer}>
            <FontAwesome5 name="bus-alt" size={28} color="#4a90e2" />
          </View>
        </Marker>
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverInfo.name}</Text>
          <Text style={styles.vehicleInfo}>{driverInfo.vehicleInfo}</Text>
        </View>
        <View style={styles.statusInfo}>
          <View style={styles.statusItem}>
            <MaterialIcons name="access-time" size={24} color="#4a90e2" />
            <Text style={styles.statusText}>Tiempo estimado: {driverInfo.eta}</Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialIcons name="info" size={24} color="#4a90e2" />
            <Text style={styles.statusText}>Estado: {driverInfo.status}</Text>
          </View>
        </View>
        <Text style={styles.lastUpdate}>
          Última actualización: {driverLocation.timestamp}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  infoCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  driverInfo: {
    marginBottom: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default MapScreen; 