import { View } from 'react-native';
// import MapboxGL from '@rnmapbox/maps';
import { useDriverStore } from '@/lib/stores/driver-store';
import { StatusButton } from '@/components/driver/StatusButton';

// Set your Mapbox access token
// MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

export default function DriverMapScreen() {
  const { currentLocation, students } = useDriverStore();
  const handleStatusChange = () => {};

  return (
    <View className="flex-1">
      {/* <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[currentLocation?.longitude || -122.4324, currentLocation?.latitude || 37.78825]}
        />

        {students.map(student => (
          <MapboxGL.PointAnnotation
            key={student.id}
            id={student.id.toString()}
            coordinate={[student.location.longitude, student.location.latitude]}
          >
            <View style={{ backgroundColor: student.status === 'waiting' ? 'green' : 'red', width: 10, height: 10, borderRadius: 5 }} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView> */}

      <StatusButton 
        currentStatus={'waiting'}
        onStatusChange={handleStatusChange}
      />
    </View>
  );
}
