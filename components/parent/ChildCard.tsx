// components/parent/ChildCard.tsx
import { Pressable, Text, View, Image } from 'react-native';
import { formatDistanceToNow, addMinutes, format } from 'date-fns';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { StudentStatus } from '@/lib/stores/driver-store';
import ChildLocationButton from '../driver/ChildLocationButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChildCardProps = {
  name: string;
  status: StudentStatus;
  lastUpdated: string;
  onPress: () => void;
  location: { latitude: number; longitude: number };
};

const statusConfig: Record<StudentStatus, { label: string; color: string }> = {
  waiting: { label: 'Waiting for pickup', color: 'bg-gray-400' },
  'picked-up': { label: 'Picked up', color: 'bg-green-400' },
  'in-transit': { label: 'In transit', color: 'bg-yellow-400' },
  'dropped-off': { label: 'Dropped off', color: 'bg-blue-400' },
};

export const ChildCard = ({ name, status, lastUpdated, onPress, location }: ChildCardProps) => {
  const scale = useSharedValue(1);
  const formattedTime = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });
  const eta = format(addMinutes(new Date(lastUpdated), 15), 'hh:mm a');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      className="bg-white rounded-lg p-4 mb-4 shadow-sm"
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: `https://i.pravatar.cc/40?u=${name}` }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">{name}</Text>
            <View className={`w-3 h-3 rounded-full ${statusConfig[status].color}`} />
          </View>
          
          <View className="mt-1 flex-row justify-between items-center">
            <Text className="text-gray-500 text-sm">ETA: {eta}</Text>
            <Text className="text-sm text-gray-400">{formattedTime}</Text>
          </View>
        </View>
      </View>

      <View className="mt-2">
        <Text className="text-gray-500">{statusConfig[status].label}</Text>
      </View>
      <ChildLocationButton latitude={location.latitude} longitude={location.longitude} />
    </AnimatedPressable>
  );
};