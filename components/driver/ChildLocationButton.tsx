import React from 'react';
import { Linking, Platform, TouchableOpacity, Text, View } from 'react-native';

interface LocationButtonProps {
  latitude: number;
  longitude: number;
  address?: string; // Address is optional for search
}

const ChildLocationButton: React.FC<LocationButtonProps> = ({ latitude, longitude, address }) => {
  const openMap = (mapType: 'google' | 'waze' | 'google_directions' | 'waze_directions' | 'google_search') => {
    let url: string | undefined = undefined;

    switch (mapType) {
      case 'google':
        url = Platform.OS === 'ios'
          ? `http://maps.apple.com/?q=${latitude},${longitude}`
          : `http://maps.google.com/?q=${latitude},${longitude}`; // Use Google Maps query parameter
        break;
      case 'waze':
        url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
        break;
      case 'google_directions':
        url = `http://maps.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`; // Correct Google Maps directions URL
        break;
      case 'waze_directions':
        url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
        break;
      case 'google_search':
        url = address ? `https://www.google.com/search/?api=1&query=${encodeURIComponent(address)}` : undefined; // Encode address
        break;
      default:
        break;
    }

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            console.log(`Unable to open: ${url}`);
            if (mapType === 'waze') {
              openMap('google'); // Fallback to Google Maps
              alert('Waze is not installed, opening Google Maps.');
            } else if (Platform.OS === 'ios' && mapType === 'google') {
              alert('Google Maps is not installed, or you are using a simulator. Opening Apple Maps.');
            }
          }
        })
        .catch((error) => console.error('An error occurred', error));
    } else if (mapType === 'google_search' && !address) {
        alert("Please provide an address for the search.");
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => openMap('google')}>
        <Text className="text-blue-500 underline font-bold">Abrir Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChildLocationButton;