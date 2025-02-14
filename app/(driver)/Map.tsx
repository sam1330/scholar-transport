import { View, StyleSheet } from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
import { useDriverStore } from '@/lib/stores/driver-store';
import { StatusButton } from '@/components/driver/StatusButton';
import MapView, { Marker } from 'react-native-maps';

// Set your Mapbox access token
// MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

export default function DriverMapScreen() {
  const { currentLocation, students } = useDriverStore();
  const handleStatusChange = () => {};

  return (
    <View className="flex-1">
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 18.4861,
          longitude: -69.9312,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 18.4861, longitude: -69.9312 }} title="Santo Domingo" />
      </MapView>

      <StatusButton 
        currentStatus={'waiting'}
        onStatusChange={handleStatusChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
